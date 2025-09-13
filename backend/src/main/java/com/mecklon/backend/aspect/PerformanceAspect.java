package com.mecklon.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PerformanceAspect {

    @Around("execution(* com.mecklon.backend.service.*.*(..))")
    public Object monitor(ProceedingJoinPoint jp) throws Throwable {
        long before = System.currentTimeMillis();
        Object obj = jp.proceed();
        long after = System.currentTimeMillis();
        System.out.println(jp.getSignature().getName()+" : "+(after-before));
        return obj;
    }
}
