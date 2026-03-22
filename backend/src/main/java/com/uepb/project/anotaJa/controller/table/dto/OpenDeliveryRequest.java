package com.uepb.project.anotaJa.controller.table.dto;

public record OpenDeliveryRequest(
        String address,
        String phone,
        Double fee,
        String notes,
        String deliveryStatus
) {}