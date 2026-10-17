package com.demo.login_demo.model; // Keep your package

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="menus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // changed int to Long (standard for DB IDs)

    // 1. Rename these to match your Frontend JSON keys
    // Frontend sends: { "name": "...", "url": "..." }
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String url;

    // 2. NEW: Stores the Lucide Icon name (e.g., "UserPlus") or Emoji
    private String image;

    // 3. NEW: Stores the order (e.g., 1, 2, 3)
    // We call it 'sortOrder' because 'order' is a reserved keyword in SQL
    private Integer sortOrder;

    // 4. NEW: For your Active/Disabled tabs
    @Column(columnDefinition = "boolean default true")
    private boolean enabled = true;
}