CREATE TABLE navigation_permissions (
    code VARCHAR(100) PRIMARY KEY,
    label VARCHAR(255) NOT NULL
);

CREATE TABLE navigation_roles (
    code VARCHAR(100) PRIMARY KEY,
    label VARCHAR(255) NOT NULL
);

CREATE TABLE navigation_licenses (
    code VARCHAR(100) PRIMARY KEY,
    label VARCHAR(255) NOT NULL
);

CREATE TABLE navigation_role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_code VARCHAR(100) NOT NULL REFERENCES navigation_roles(code) ON DELETE CASCADE,
    permission_code VARCHAR(100) NOT NULL REFERENCES navigation_permissions(code) ON DELETE CASCADE,
    CONSTRAINT uk_navigation_role_permission UNIQUE (role_code, permission_code)
);

CREATE TABLE navigation_modules (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    icon VARCHAR(128),
    section_code VARCHAR(100) NOT NULL,
    section_label VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    permission_code VARCHAR(100) NOT NULL REFERENCES navigation_permissions(code),
    license_code VARCHAR(100) REFERENCES navigation_licenses(code)
);

CREATE TABLE company_licenses (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES societes(id) ON DELETE CASCADE,
    license_code VARCHAR(100) NOT NULL REFERENCES navigation_licenses(code),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE,
    end_date DATE
);

CREATE UNIQUE INDEX ux_company_licenses_active
    ON company_licenses(company_id, license_code)
    WHERE is_active;

INSERT INTO navigation_permissions (code, label) VALUES
    ('NAV_DASHBOARD', 'Tableau de bord'),
    ('NAV_CLIENTS', 'Clients'),
    ('NAV_CHANTIERS', 'Chantiers'),
    ('NAV_INTERVENTIONS', 'Interventions terrain'),
    ('NAV_DEVIS', 'Devis'),
    ('NAV_FACTURES', 'Factures'),
    ('NAV_PRODUITS', 'Gestion de stock'),
    ('NAV_ADMIN', 'Administration');

INSERT INTO navigation_roles (code, label) VALUES
    ('ADMIN', 'Administrateur'),
    ('GERANT', 'Gérant'),
    ('TECHNICIEN', 'Technicien');

INSERT INTO navigation_licenses (code, label) VALUES
    ('STANDARD', 'Accès standard'),
    ('FACTURATION', 'Module facturation'),
    ('STOCK', 'Module gestion de stock');

INSERT INTO navigation_role_permissions (role_code, permission_code)
SELECT role_code, permission_code
FROM (
    VALUES
        ('ADMIN', 'NAV_DASHBOARD'),
        ('ADMIN', 'NAV_CLIENTS'),
        ('ADMIN', 'NAV_CHANTIERS'),
        ('ADMIN', 'NAV_INTERVENTIONS'),
        ('ADMIN', 'NAV_DEVIS'),
        ('ADMIN', 'NAV_FACTURES'),
        ('ADMIN', 'NAV_PRODUITS'),
        ('ADMIN', 'NAV_ADMIN'),
        ('GERANT', 'NAV_DASHBOARD'),
        ('GERANT', 'NAV_CLIENTS'),
        ('GERANT', 'NAV_CHANTIERS'),
        ('GERANT', 'NAV_INTERVENTIONS'),
        ('GERANT', 'NAV_DEVIS'),
        ('GERANT', 'NAV_FACTURES'),
        ('GERANT', 'NAV_PRODUITS'),
        ('TECHNICIEN', 'NAV_DASHBOARD'),
        ('TECHNICIEN', 'NAV_CLIENTS'),
        ('TECHNICIEN', 'NAV_CHANTIERS'),
        ('TECHNICIEN', 'NAV_INTERVENTIONS')
) AS seed(role_code, permission_code);

INSERT INTO navigation_modules (
    code,
    label,
    route,
    icon,
    section_code,
    section_label,
    display_order,
    active,
    permission_code,
    license_code
) VALUES
    ('dashboard', 'Tableau de bord', '/dashboard', 'lucide:layout-dashboard', 'core', 'Pilotage', 1, TRUE, 'NAV_DASHBOARD', NULL),
    ('clients', 'Clients', '/clients', 'lucide:users', 'operations', 'Opérations', 2, TRUE, 'NAV_CLIENTS', NULL),
    ('chantiers', 'Chantiers', '/chantiers', 'lucide:clipboard-list', 'operations', 'Opérations', 3, TRUE, 'NAV_CHANTIERS', NULL),
    ('interventions', 'Interventions', '/interventions', 'lucide:wrench', 'operations', 'Opérations', 4, TRUE, 'NAV_INTERVENTIONS', NULL),
    ('devis', 'Devis', '/devis', 'lucide:file-digit', 'business', 'Gestion commerciale', 5, TRUE, 'NAV_DEVIS', 'FACTURATION'),
    ('factures', 'Factures', '/factures', 'lucide:receipt', 'business', 'Gestion commerciale', 6, TRUE, 'NAV_FACTURES', 'FACTURATION'),
    ('produits', 'Gestion de stock', '/produits', 'lucide:boxes', 'operations', 'Opérations', 7, TRUE, 'NAV_PRODUITS', 'STOCK'),
    ('administration', 'Administration', '/administration', 'lucide:shield-check', 'administration', 'Administration', 8, TRUE, 'NAV_ADMIN', NULL);
