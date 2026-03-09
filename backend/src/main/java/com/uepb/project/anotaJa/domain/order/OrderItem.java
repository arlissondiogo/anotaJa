package com.uepb.project.anotaJa.domain.order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    private String productId;

    private String name;

    private Double price;

    private Integer quantity;

}