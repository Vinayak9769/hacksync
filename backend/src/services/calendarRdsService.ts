import ContentCalendarModel from "../models/calendarModel";

export interface CalendarPersistenceInput {
    userId: string;
    sessionId: string;
    campaignTheme?: string;
    campaignName?: string;
    brandName?: string;
    startDate?: string;
    durationWeeks?: number;
    channels?: string[];
    calendar: any;
}

export interface CalendarPersistenceResult {
    saved: boolean;
    calendarId?: string;
    reason?: string;
}

class CalendarRdsService {
    async saveGeneratedCalendar(
        input: CalendarPersistenceInput,
    ): Promise<CalendarPersistenceResult> {
        try {
            const doc = await ContentCalendarModel.create({
                userId: input.userId,
                sessionId: input.sessionId,
                campaignTheme: input.campaignTheme,
                campaignName: input.campaignName,
                brandName: input.brandName,
                startDate: input.startDate ? new Date(input.startDate) : undefined,
                durationWeeks: input.durationWeeks,
                channels: input.channels,
                calendar: input.calendar,
            });

            return {
                saved: true,
                calendarId: doc._id.toString(),
            };
        } catch (error: any) {
            console.error("Error saving calendar to MongoDB:", error);
            return {
                saved: false,
                reason: error.message || "Failed to save to database",
            };
        }
    }

    async getCalendarsBySession(userId: string, sessionId: string): Promise<any[]> {
        try {
            const docs = await ContentCalendarModel.find({ userId, sessionId })
                .sort({ createdAt: -1 })
                .lean();

            return docs.map(doc => ({
                id: doc._id.toString(),
                session_id: doc.sessionId,
                campaign_theme: doc.campaignTheme,
                campaign_name: doc.campaignName,
                brand_name: doc.brandName,
                start_date: doc.startDate,
                duration_weeks: doc.durationWeeks,
                channels: doc.channels,
                calendar: doc.calendar,
                created_at: doc.createdAt,
            }));
        } catch (error) {
            console.error("Error fetching calendars from MongoDB:", error);
            return [];
        }
    }
}

export default new CalendarRdsService();
