package com.uepb.project.anotaJa.controller.table.dto;

public record MergeTablesRequest(
        String sourceTableId,
        String targetTableId
) {}