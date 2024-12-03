﻿using API.DAO;
using API.DTOs.RequestDTO;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/staff-management")]
    [Authorize(Roles = "Admin")]
    public class AdminStaffController : Controller
    {
        private readonly AuthenticationDAO dao;
        public AdminStaffController(AuthenticationDAO dao)
        {
            this.dao = dao;
        }

        [HttpPost("add-staff")]
        public IActionResult AddStaff([FromForm] AddStaffDTO addStaffDTO)
        {
            var reponse = dao.AddStaff(addStaffDTO);
            return StatusCode(reponse.StatusCode, reponse);
        }

        [HttpGet("get-all-staffs")]
        public IActionResult GetAllStaffs()
        {
            var response = dao.GetAllStaff();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("update-staff")]
        public IActionResult UpdateStaff([FromForm] UpdateStaffDTO updateStaffDTO)
        {
            var response = dao.UpdateStaffInformation(updateStaffDTO);
            return StatusCode(response.StatusCode, response);
        }
    }
}
