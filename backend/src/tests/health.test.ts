import request from "supertest";
import { createApp } from "../app";
import { Express } from "express";

describe("Health Check Endpoints", () => {
  let app: Express;

  beforeAll(async () => {
    app = await createApp();
  });

  it("should return 200 for main health check", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  it("should return 200 for social media health check", async () => {
    const res = await request(app).get("/api/social/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("integrations");
  });

  it("should return 200 for reddit health check", async () => {
    const res = await request(app).get("/api/reddit/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("redditEnabled");
  });
});
