package com.uepb.project.anotaJa.domain.table;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Table {

    @Id
    private String id;

    private Integer number;

    private String clientName;

    private TableStatus status;

    private String ownerId;

}