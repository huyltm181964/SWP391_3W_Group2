﻿using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers.Staff
{
    [Route("api/v1/staff/import")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffImportController : ControllerBase
    {
        private readonly ImportDAO importDAO;

        public StaffImportController(ImportDAO importDAO)
        {
            this.importDAO = importDAO;
        }

        [HttpGet]
        public IActionResult GetALlImport()
        {
            var response = importDAO.GetAllImports();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("import-product")]
        public IActionResult ImportProduct(ImportDTO importDTO)
        {
            var response = importDAO.ImportProduct(importDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("get-import-details")]
        public IActionResult GetImportDetails()
        {
            var response = importDAO.GetImportDetails();
            return StatusCode(response.StatusCode, response);
        }
    }
}

