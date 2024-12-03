using API.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/statistics")]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : Controller
    {
        private readonly StatisticsDAO dao;
        public StatisticsController(StatisticsDAO _dao)
        {
            this.dao = _dao;
        }

        [HttpGet("total-comments")]
        public IActionResult GetTotalComments()
        {
            return Ok(dao.TotalComments());
        }

        [HttpGet("total-users")]
        public IActionResult GetTotalUsers()
        {
            return Ok(dao.TotalUsers());
        }

        [HttpGet("total-orders")]
        public IActionResult GetTotalOrders()
        {
            return Ok(dao.TotalOrders());
        }

        [HttpGet("total-revenues")]
        public IActionResult GetTotalRevenues()
        {
            return Ok(dao.TotalRevenues());
        }

        [HttpGet("monthly-revenues")]
        public IActionResult GetMonthlyRevenues()
        {
            return Ok(dao.MonthlyRevenues());
        }
    }
}
