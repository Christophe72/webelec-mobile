-- =========================================================
-- V18__navigation_seed.sql
-- Seed navigation dynamique (sections, modules, permissions)
-- =========================================================

-- =========================
-- 1. SECTIONS DE NAVIGATION
-- =========================
INSERT INTO navigation_sections (code, label, display_order)
SELECT v.code, v.label, v.display_order
FROM (VALUES
('DASHBOARD', 'Pilotage', 1),
('BUSINESS',  'Gestion commerciale', 2),
('RGIE',      'RGIE & conformité', 3),
('ADMIN',     'Administration', 4)
) AS v(code, label, display_order)
WHERE NOT EXISTS (
	SELECT 1 FROM navigation_sections ns WHERE ns.code = v.code
);

-- =========================
-- 2. PERMISSIONS
-- =========================
INSERT INTO permissions (code, label)
SELECT v.code, v.label
FROM (VALUES
('VIEW_DASHBOARD', 'Accéder au tableau de bord'),
('VIEW_DEVIS',     'Accéder aux devis'),
('VIEW_FACTURES',  'Accéder aux factures'),
('VIEW_RGIE',      'Accéder aux modules RGIE'),
('ADMIN_ACCESS',   'Accéder à l’administration')
) AS v(code, label)
WHERE NOT EXISTS (
	SELECT 1 FROM permissions p WHERE p.code = v.code
);

-- =========================
-- 3. MODULES DE NAVIGATION
-- =========================
INSERT INTO navigation_modules
(code, label, route, icon, display_order, active, section_code)
SELECT v.code, v.label, v.route, v.icon, v.display_order, v.active, v.section_code
FROM (VALUES
('dashboard', 'Tableau de bord', '/dashboard', 'lucide:layout-dashboard', 1, 1, 'DASHBOARD'),

('devis',     'Devis',     '/business/devis',     'lucide:file-digit', 1, 1, 'BUSINESS'),
('factures',  'Factures',  '/business/factures',  'lucide:receipt',    2, 1, 'BUSINESS'),

('rgie_rules', 'Règles RGIE', '/rgie/regles', 'lucide:book-open', 1, 1, 'RGIE'),

('admin_users', 'Utilisateurs', '/admin/users', 'lucide:users', 1, 1, 'ADMIN')
) AS v(code, label, route, icon, display_order, active, section_code)
WHERE NOT EXISTS (
	SELECT 1 FROM navigation_modules nm WHERE nm.code = v.code
);

-- =========================
-- 4. ROLES ↔ PERMISSIONS
-- =========================
-- Hypothèse : rôles existants (ADMIN, GERANT, TECHNICIEN)

INSERT INTO role_permissions (role_code, permission_code)
SELECT v.role_code, v.permission_code
FROM (VALUES
('ADMIN', 'VIEW_DASHBOARD'),
('ADMIN', 'VIEW_DEVIS'),
('ADMIN', 'VIEW_FACTURES'),
('ADMIN', 'VIEW_RGIE'),
('ADMIN', 'ADMIN_ACCESS'),

('GERANT', 'VIEW_DASHBOARD'),
('GERANT', 'VIEW_DEVIS'),
('GERANT', 'VIEW_FACTURES'),
('GERANT', 'VIEW_RGIE'),

('TECHNICIEN', 'VIEW_DASHBOARD'),
('TECHNICIEN', 'VIEW_RGIE')
) AS v(role_code, permission_code)
WHERE NOT EXISTS (
	SELECT 1 FROM role_permissions rp
	WHERE rp.role_code = v.role_code
	  AND rp.permission_code = v.permission_code
);

-- =========================
-- 5. MODULES ↔ PERMISSIONS
-- =========================
INSERT INTO module_permissions (module_code, permission_code)
SELECT v.module_code, v.permission_code
FROM (VALUES
('dashboard',    'VIEW_DASHBOARD'),
('devis',        'VIEW_DEVIS'),
('factures',     'VIEW_FACTURES'),
('rgie_rules',   'VIEW_RGIE'),
('admin_users',  'ADMIN_ACCESS')
) AS v(module_code, permission_code)
WHERE NOT EXISTS (
	SELECT 1 FROM module_permissions mp
	WHERE mp.module_code = v.module_code
	  AND mp.permission_code = v.permission_code
);

-- =========================
-- 6. MODULES ↔ LICENCES (OPTIONNEL)
-- =========================
-- Hypothèse : licence RGIE existe avec code = 'RGIE'

INSERT INTO module_licenses (module_code, license_code)
SELECT v.module_code, v.license_code
FROM (VALUES
('rgie_rules', 'RGIE')
) AS v(module_code, license_code)
WHERE NOT EXISTS (
	SELECT 1 FROM module_licenses ml
	WHERE ml.module_code = v.module_code
	  AND ml.license_code = v.license_code
);

-- =========================================================
-- FIN MIGRATION
-- =========================================================
