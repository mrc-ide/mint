package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.AppProperties
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

    override fun getErrorPath(): String {
        return "/error"
    }

    @RequestMapping("/error")
    fun handleError(request: HttpServletRequest): ModelAndView {
        val status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE)
        val viewName = if (status?.toString()?.toInt() == HttpStatus.NOT_FOUND.value()) {
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
