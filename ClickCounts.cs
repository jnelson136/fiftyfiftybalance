using System.Text.Json;

namespace FiftyFifty
{
    public class ClickCounts
    {

        private static string FilePath = "clickCounts.json";
        public int CountA { get; set; }
        public int CountB { get; set; }

        public int AllTimeClicks { get; set; }

        public DateTime? TimerStart  {get; set; }
        public int LastElapsedTime { get; set; }

        public static ClickCounts LoadFromFile() 
        {
            if (File.Exists(FilePath))
            {
                var jsonData = File.ReadAllText(FilePath);
                return JsonSerializer.Deserialize<ClickCounts>(jsonData) ?? new ClickCounts();
            }
            return new ClickCounts();
        }

        public void SaveToFile()
        {
            var jsonData = JsonSerializer.Serialize(this);
            File.WriteAllText(FilePath, jsonData);
        }

        public int GetElapsedTime()
        {
            if (TimerStart.HasValue)
            {
                return LastElapsedTime + (int)(DateTime.Now - TimerStart.Value).TotalSeconds;
            }
            return LastElapsedTime;
        }

        public void ResetTimer()
        {
            TimerStart = null;
        }

        public void RecordLastElapsedTime()
        {
            LastElapsedTime = GetElapsedTime();
        }
    }
}
