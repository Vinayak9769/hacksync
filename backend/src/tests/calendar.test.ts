import request from "supertest";
import { createApp } from "../app";
import { Express } from "express";
import calendarRdsService from "../services/calendarRdsService";

jest.mock("../services/calendarRdsService");
jest.mock("../middlewares/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: "user-123", email: "test@example.com" };
    next();
  }
}));

const mockedCalendarRdsService = calendarRdsService as jest.Mocked<typeof calendarRdsService>;

describe("Calendar Endpoints", () => {
  let app: Express;

  beforeAll(async () => {
    app = await createApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/calendar", () => {
    it("should return 400 if sessionId or calendar is missing", async () => {
      const res = await request(app)
        .post("/api/calendar")
        .send({ brandName: "Test Brand" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "sessionId and calendar are required");
    });
    it("should return 201 when calendar is saved successfully", async () => {
      mockedCalendarRdsService.saveGeneratedCalendar.mockResolvedValue({
        saved: true,
        calendarId: "123",
      });

      const res = await request(app)
        .post("/api/calendar")
        .send({
          sessionId: "session-123",
          calendar: [{ week: 1, content: "Post details" }],
          brandName: "Brand X",
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: "Calendar information saved to RDS",
        calendarId: "123",
      });
      expect(mockedCalendarRdsService.saveGeneratedCalendar).toHaveBeenCalledWith({
        userId: "user-123",
        sessionId: "session-123",
        calendar: [{ week: 1, content: "Post details" }],
        brandName: "Brand X",
        campaignName: undefined,
        campaignTheme: undefined,
        channels: undefined,
        startDate: undefined,
        durationWeeks: undefined,
      });
    });

    it("should return 503 if save fails (e.g. database unavailable)", async () => {
      mockedCalendarRdsService.saveGeneratedCalendar.mockResolvedValue({
        saved: false,
        reason: "Database down",
      });

      const res = await request(app)
        .post("/api/calendar")
        .send({
          sessionId: "session-123",
          calendar: [{ week: 1, content: "Post details" }],
        });

      expect(res.status).toBe(503);
      expect(res.body).toHaveProperty("error", "Database down");
    });
  });

  describe("GET /api/calendar/session/:sessionId", () => {
    it("should return 200 with calendars", async () => {
      const mockCalendars = [
        { id: 1, session_id: "session-123", calendar_data: {} },
      ];
      mockedCalendarRdsService.getCalendarsBySession.mockResolvedValue(mockCalendars as any);

      const res = await request(app).get("/api/calendar/session/session-123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        count: 1,
        calendars: mockCalendars,
      });
      expect(mockedCalendarRdsService.getCalendarsBySession).toHaveBeenCalledWith("user-123", "session-123");
    });
  });
});
