import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { TaskDto, UpdateTaskDto } from 'src/dto/task.dto';
// need refresh token and more understand to the problem
export class GoogleCalendarService {
    private auth: OAuth2Client;

    constructor() {
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL,
          
        );
    }
    async handleAuth(code: string) {
      const {tokens} = await this.auth.getToken(code);
      this.auth.setCredentials(tokens);
    }
    generateAuthUrl(): string {
        const scopes = ['https://www.googleapis.com/auth/calendar'];
        return this.auth.generateAuthUrl({
          access_type: 'online',
          scope: scopes,
        });
      }
      async getToken(code: string) {
        const { tokens } = await this.auth.getToken(code);
        this.auth.setCredentials(tokens);
        console.log(tokens);
        // Here, you should store the tokens in your database and associate them with the user
        return tokens;
      }

    async listEvents() {
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return res.data.items;
    }
    async createEvent(todo: TaskDto) {
        const startDate = todo.startDate instanceof Date ? todo.startDate : new Date(todo.startDate);
        const endDate = todo.endDate instanceof Date ? todo.endDate : new Date(todo.endDate);
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        const event = {
          summary: todo.title,
          description: todo.description,
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() }, 
        };
      
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
      }
      
      async updateEvent(id: string, todo: UpdateTaskDto) {
        const startDate = todo.startDate instanceof Date ? todo.startDate : new Date(todo.startDate);
        const endDate = todo.endDate instanceof Date ? todo.endDate : new Date(todo.endDate);
    
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        const event = {
            summary: todo.title,
            description: todo.description,
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() },
        };
    
        await calendar.events.update({
            calendarId: 'primary',
            eventId: id,
            requestBody: event,
        });
    }
      
    async deleteEvent(id: string) {
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: id,
        });
    }
    
}
