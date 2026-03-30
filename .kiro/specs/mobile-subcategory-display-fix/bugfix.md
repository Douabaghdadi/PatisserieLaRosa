# Bugfix Requirements Document

## Introduction

Ce document décrit les exigences pour corriger le bug d'affichage des sous-catégories sur la version mobile de l'application. Actuellement, les catégories principales sont visibles dans le menu mobile (Gâteaux & Entremets, Pâtisserie Fine, etc.) mais leurs sous-catégories correspondantes ne s'affichent pas, contrairement à la version desktop où elles apparaissent dans des menus déroulants au survol.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user opens the mobile menu THEN the system displays only main categories without their subcategories

1.2 WHEN a user clicks on a main category in the mobile menu THEN the system navigates directly to the category page without showing subcategory options

1.3 WHEN a user wants to access subcategories on mobile THEN the system forces them to navigate to the category page first and then use filters

### Expected Behavior (Correct)

2.1 WHEN a user opens the mobile menu THEN the system SHALL display main categories with expandable subcategory sections

2.2 WHEN a user clicks on a main category in the mobile menu THEN the system SHALL expand to show its subcategories inline

2.3 WHEN a user wants to access subcategories on mobile THEN the system SHALL provide direct navigation links to subcategory pages

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user uses the desktop navigation THEN the system SHALL CONTINUE TO display subcategories in hover dropdown menus

3.2 WHEN a user hovers over categories on desktop THEN the system SHALL CONTINUE TO show the current dropdown with subcategories and category images

3.3 WHEN a user navigates to category pages THEN the system SHALL CONTINUE TO display subcategory filters in the sidebar and mobile filter sections