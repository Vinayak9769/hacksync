import { Request, Response } from "express";
import calendarRdsService from "../services/calendarRdsService";

class CalendarController {
    /**
     * Save content calendar data to RDS.
     * POST /api/calendar
     */
    async saveCalendar(req: Request, res: Response): Promise<void> {
        try {
            const {
                sessionId,
                campaignTheme,
                campaignName,
                brandName,
                startDate,
                durationWeeks,
                channels,
                calendar,
            } = req.body;

            if (!sessionId || !calendar) {
                res.status(400).json({
                    error: "sessionId and calendar are required",
                });
                return;
            }

            const saveResult = await calendarRdsService.saveGeneratedCalendar({
                sessionId,
                campaignTheme,
                campaignName,
                brandName,
                startDate,
                durationWeeks,
                channels,
                calendar,
            });

            if (!saveResult.saved) {
                res.status(503).json({
                    error: saveResult.reason || "Calendar persistence unavailable",
                });
                return;
            }

            res.status(201).json({
                success: true,
                message: "Calendar information saved to RDS",
                calendarId: saveResult.calendarId,
            });
        } catch (error) {
            console.error("Error saving calendar to RDS:", error);
            res.status(500).json({
                error: "Failed to save calendar",
                details: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Get content calendars for a session from RDS.
     * GET /api/calendar/session/:sessionId
     */
    async getCalendarsBySession(req: Request, res: Response): Promise<void> {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                res.status(400).json({
                    error: "sessionId is required",
                });
                return;
            }

            const calendars = await calendarRdsService.getCalendarsBySession(
                sessionId,
            );

            res.json({
                success: true,
                count: calendars.length,
                calendars,
            });
        } catch (error) {
            console.error("Error fetching calendars from RDS:", error);
            res.status(500).json({
                error: "Failed to fetch calendars",
                details: error instanceof Error ? error.message : String(error),
            });
        }
    }
}

export default new CalendarController();
