export interface IPushService {
  runWeeklyPushNotifications() : Promise<number>
  runDailyPushNotifications() : Promise<number>
}
