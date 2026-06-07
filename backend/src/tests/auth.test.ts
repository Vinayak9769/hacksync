import request from "supertest";
import { createApp } from "../app";
import { Express } from "express";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("../models/userModel");

const mockedUser = UserModel as jest.Mocked<typeof UserModel>;

describe("Auth Endpoints", () => {
  let app: Express;
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_test_secret";

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    app = await createApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Name, email, and password are required");
    });

    it("should return 400 if password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "short"
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Password must be at least 8 characters long");
    });

    it("should return 400 if user already exists", async () => {
      mockedUser.findOne.mockResolvedValue({ _id: "existing-user" } as any);

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "existing@example.com",
          password: "password123"
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "An account with this email already exists");
    });

    it("should create user and return 201 with token", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedUser.create.mockResolvedValue({
        _id: "new-user-id",
        name: "newuser",
        email: "new@example.com",
        onboarded: false,
        onboarding: {}
      } as any);

      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "newuser",
          email: "new@example.com",
          password: "password123"
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toEqual({
        _id: "new-user-id",
        name: "newuser",
        email: "new@example.com",
        onboarded: false,
        onboarding: {}
      });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 if email or password missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    it("should return 401 if user not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123"
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });

    it("should return 200 with token if credentials match", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const mockUser = {
        _id: "user-123",
        name: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        onboarded: false,
        onboarding: {}
      };
      mockedUser.findOne.mockResolvedValue(mockUser as any);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123"
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toEqual(mockUser);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 if token is missing", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
    });

    it("should return user details if token is valid", async () => {
      const token = jwt.sign({ id: "user-123", email: "test@example.com" }, JWT_SECRET);
      
      const mockUser = {
        _id: "user-123",
        name: "testuser",
        email: "test@example.com",
        onboarded: true,
        onboarding: { brandName: "My Brand" }
      };
      mockedUser.findById.mockResolvedValue(mockUser as any);

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.user).toEqual(mockUser);
    });
  });

  describe("POST /api/auth/onboarding", () => {
    it("should save onboarding details and return user", async () => {
      const token = jwt.sign({ id: "user-123", email: "test@example.com" }, JWT_SECRET);
      
      const onboardingData = {
        brandName: "Acme Corp",
        brandDescription: "SaaS company",
        industry: "Tech",
        campaignGoal: "Leads",
        targetAudience: "Developers",
        budget: "Medium",
        channels: ["LinkedIn", "Twitter"],
        tone: "Professional"
      };

      const mockUpdatedUser = {
        _id: "user-123",
        name: "testuser",
        email: "test@example.com",
        onboarded: true,
        onboarding: onboardingData
      };

      mockedUser.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser as any);

      const res = await request(app)
        .post("/api/auth/onboarding")
        .set("Authorization", `Bearer ${token}`)
        .send(onboardingData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.user).toEqual(mockUpdatedUser);
      expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(
        "user-123",
        {
          $set: {
            onboarding: onboardingData,
            onboarded: true
          }
        },
        { new: true }
      );
    });
  });
});
