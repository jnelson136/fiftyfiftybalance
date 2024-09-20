using Microsoft.AspNetCore.Mvc;
using FiftyFifty;

[ApiController]
[Route("api/click")]
public class ClickController : ControllerBase
{
    private static ClickCounts _clickCounts = ClickCounts.LoadFromFile();

    [HttpPost("increment-alltimeclicks")]
    public IActionResult IncrementAllTimeClicks()
    {
        _clickCounts.AllTimeClicks += 1;
        _clickCounts.SaveToFile();
        return Ok(_clickCounts);
    }

    [HttpPost("clickA")]
    public IActionResult IncrementClickA()
    {
        _clickCounts.CountA++;
        _clickCounts.AllTimeClicks++;

        CheckAndStartTimer();
        _clickCounts.SaveToFile();
        return Ok(_clickCounts);
    }

    [HttpPost("clickB")]
    public IActionResult IncrementClickB()
    {
        _clickCounts.CountB++;
        _clickCounts.AllTimeClicks++;
        
        CheckAndStartTimer();
        _clickCounts.SaveToFile();
        return Ok(_clickCounts);
    }

    [HttpGet]
    public IActionResult GetClickCounts()
    {
        Response.Headers["Cache-Control"] = "no-store";
        var timerValue = (_clickCounts.CountA == _clickCounts.CountB) ? _clickCounts.GetElapsedTime() : _clickCounts.LastElapsedTime;
        return Ok(new { _clickCounts.CountA, _clickCounts.CountB, timerValue, AllTimeClicks = _clickCounts.AllTimeClicks });
    }

    private void CheckAndStartTimer()
    {
        if (_clickCounts.CountA == _clickCounts.CountB)
        {
            if (!_clickCounts.TimerStart.HasValue)
            {
                _clickCounts.TimerStart = DateTime.Now; // Start the timer
            }
        }
        else
        {
            _clickCounts.RecordLastElapsedTime(); // Store last elapsed time
            _clickCounts.ResetTimer(); // Stop the timer
        }
    }


}
