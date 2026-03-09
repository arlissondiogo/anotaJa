package com.uepb.project.anotaJa.infra.table;

import com.uepb.project.anotaJa.domain.table.Table;
import com.uepb.project.anotaJa.domain.table.TableStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TableRepository extends MongoRepository<Table, String> {

    List<Table> findByStatus(TableStatus status);

}