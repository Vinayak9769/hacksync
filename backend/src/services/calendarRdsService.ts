import { Pool } from "pg";

export interface CalendarPersistenceInput {
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
    calendarId?: number;
    reason?: string;
}

class CalendarRdsService {
    private pool: Pool | null = null;
    private schemaReady = false;

    private isConfigured(): boolean {
        if (process.env.RDS_DATABASE_URL || process.env.DATABASE_URL) {
            return true;
        }

        return !!(
            process.env.RDS_HOST &&
            process.env.RDS_USER &&
            process.env.RDS_PASSWORD &&
            process.env.RDS_DATABASE
        );
    }

    private getPool(): Pool | null {
        if (!this.isConfigured()) {
            return null;
        }

        if (!this.pool) {
            const sslEnabled = ["1", "true", "yes"].includes(
                (process.env.RDS_SSL || "").toLowerCase(),
            );

            if (process.env.RDS_DATABASE_URL || process.env.DATABASE_URL) {
                this.pool = new Pool({
                    connectionString:
                        process.env.RDS_DATABASE_URL || process.env.DATABASE_URL,
                    ssl: sslEnabled
                        ? {
                              rejectUnauthorized: false,
                          }
                        : undefined,
                });
            } else {
                this.pool = new Pool({
                    host: process.env.RDS_HOST,
                    port: parseInt(process.env.RDS_PORT || "5432", 10),
                    user: process.env.RDS_USER,
                    password: process.env.RDS_PASSWORD,
                    database: process.env.RDS_DATABASE,
                    ssl: sslEnabled
                        ? {
                              rejectUnauthorized: false,
                          }
                        : undefined,
                });
            }
        }

        return this.pool;
    }

    private async ensureSchema(): Promise<boolean> {
        if (this.schemaReady) {
            return true;
        }

        const pool = this.getPool();
        if (!pool) {
            return false;
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS content_calendars (
                id BIGSERIAL PRIMARY KEY,
                session_id VARCHAR(128) NOT NULL,
                campaign_theme TEXT,
                campaign_name TEXT,
                brand_name TEXT,
                start_date DATE,
                duration_weeks INTEGER,
                channels JSONB NOT NULL,
                calendar JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_content_calendars_session_id
            ON content_calendars(session_id);
        `);

        this.schemaReady = true;
        return true;
    }

    async saveGeneratedCalendar(
        input: CalendarPersistenceInput,
    ): Promise<CalendarPersistenceResult> {
        const schemaOk = await this.ensureSchema();
        if (!schemaOk) {
            return {
                saved: false,
                reason: "RDS is not configured",
            };
        }

        const pool = this.getPool();
        if (!pool) {
            return {
                saved: false,
                reason: "RDS connection unavailable",
            };
        }

        const query = `
            INSERT INTO content_calendars (
                session_id,
                campaign_theme,
                campaign_name,
                brand_name,
                start_date,
                duration_weeks,
                channels,
                calendar
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
            RETURNING id;
        `;

        const values = [
            input.sessionId,
            input.campaignTheme || null,
            input.campaignName || null,
            input.brandName || null,
            input.startDate || null,
            input.durationWeeks || null,
            JSON.stringify(input.channels || []),
            JSON.stringify(input.calendar || []),
        ];

        const result = await pool.query(query, values);
        return {
            saved: true,
            calendarId: result.rows[0]?.id,
        };
    }

    async getCalendarsBySession(sessionId: string): Promise<any[]> {
        const schemaOk = await this.ensureSchema();
        if (!schemaOk) {
            return [];
        }

        const pool = this.getPool();
        if (!pool) {
            return [];
        }

        const result = await pool.query(
            `
                SELECT
                    id,
                    session_id,
                    campaign_theme,
                    campaign_name,
                    brand_name,
                    start_date,
                    duration_weeks,
                    channels,
                    calendar,
                    created_at
                FROM content_calendars
                WHERE session_id = $1
                ORDER BY created_at DESC;
            `,
            [sessionId],
        );

        return result.rows;
    }
}

export default new CalendarRdsService();
