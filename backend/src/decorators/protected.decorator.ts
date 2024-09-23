import { UseGuards } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionGuard } from "src/guards/permission.guard";


export function Protected() {
    return applyDecorators(UseGuards(JwtAuthGuard, PermissionGuard));
}