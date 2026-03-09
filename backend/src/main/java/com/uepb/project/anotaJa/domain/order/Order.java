package com.uepb.project.anotaJa.domain.order;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id;

    private String tableId;

    private String clientName;

    private List<OrderItem> items;

    private Double total;

    private Boolean paid;

    private Boolean canceled;

}