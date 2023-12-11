package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.AppProperties
import org.imperial.mrc.mint.httpStatusFromCode
import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.set
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.servlet.ModelAndView
import javax.servlet.RequestDispatcher
import javax.servlet.http.HttpServletRequest

@Controller
class MINTErrorController(private val appProperties: AppProperties) : ErrorController {
    @RequestMapping("\${server.error.path}")
    fun handleError(request: HttpServletRequest): ModelAndView {
        val status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)
            ?.toString()?.toInt() ?: 0
        val codesToReturnNotFound = listOf(HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        val viewName = if (codesToReturnNotFound.contains(httpStatusFromCode(status))) {
            "404"
        } else {
            "500"
        }
        val mv = ModelAndView()
        mv.addObject("title", appProperties.applicationTitle)
        mv.viewName = viewName
        return mv
    }
}
