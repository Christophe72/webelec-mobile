-- Harmonise les sections et enrichit la navigation dynamique

IF NOT EXISTS (SELECT 1 FROM navigation_licenses WHERE code = 'RGIE')
BEGIN
    INSERT INTO navigation_licenses (code, label)
    VALUES ('RGIE', 'Conformité RGIE');
END;

MERGE navigation_permissions AS target
USING (
    VALUES
        ('NAV_RGIE_DOSSIERS', 'Dossiers RGIE'),
        ('NAV_RGIE_CONTROLES', 'Contrôles RGIE')
) AS source (code, label)
ON target.code = source.code
WHEN NOT MATCHED THEN
    INSERT (code, label)
    VALUES (source.code, source.label);

UPDATE navigation_modules
SET section_code = 'DASHBOARD',
    section_label = 'Pilotage',
    display_order = 10,
    route = '/dashboard',
    icon = 'lucide:layout-dashboard'
WHERE code = 'dashboard';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 20,
    route = '/business/clients',
    icon = 'lucide:users'
WHERE code = 'clients';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 30,
    route = '/business/chantiers',
    icon = 'lucide:clipboard-list'
WHERE code = 'chantiers';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 40,
    route = '/business/interventions',
    icon = 'lucide:wrench'
WHERE code = 'interventions';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 50,
    route = '/business/stock',
    icon = 'lucide:boxes',
    license_code = 'STOCK'
WHERE code = 'produits';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 60,
    route = '/business/devis',
    icon = 'lucide:file-digit',
    license_code = 'FACTURATION'
WHERE code = 'devis';

UPDATE navigation_modules
SET section_code = 'BUSINESS',
    section_label = 'Gestion commerciale',
    display_order = 70,
    route = '/business/factures',
    icon = 'lucide:receipt',
    license_code = 'FACTURATION'
WHERE code = 'factures';

UPDATE navigation_modules
SET section_code = 'ADMIN',
    section_label = 'Administration',
    display_order = 110,
    route = '/admin/reglages',
    icon = 'lucide:settings',
    permission_code = 'NAV_ADMIN'
WHERE code = 'administration';

MERGE navigation_modules AS target
USING (
    VALUES
        ('rgie-dossiers', 'Dossiers RGIE', '/rgie/dossiers', 'lucide:folder-check', 'RGIE', 'Conformité RGIE', 80, 1, 'NAV_RGIE_DOSSIERS', 'RGIE'),
        ('rgie-controles', 'Contrôles RGIE', '/rgie/controles', 'lucide:shield-alert', 'RGIE', 'Conformité RGIE', 90, 1, 'NAV_RGIE_CONTROLES', 'RGIE'),
        ('team-management', 'Gestion des équipes', '/admin/equipe', 'lucide:users-2', 'ADMIN', 'Administration', 100, 1, 'NAV_ADMIN', NULL)
) AS source (code, label, route, icon, section_code, section_label, display_order, active, permission_code, license_code)
ON target.code = source.code
WHEN MATCHED THEN
    UPDATE SET
        label = source.label,
        route = source.route,
        icon = source.icon,
        section_code = source.section_code,
        section_label = source.section_label,
        display_order = source.display_order,
        active = source.active,
        permission_code = source.permission_code,
        license_code = source.license_code
WHEN NOT MATCHED THEN
    INSERT (code, label, route, icon, section_code, section_label, display_order, active, permission_code, license_code)
    VALUES (source.code, source.label, source.route, source.icon, source.section_code, source.section_label, source.display_order, source.active, source.permission_code, source.license_code);

MERGE navigation_role_permissions AS target
USING (
    VALUES
        ('ADMIN', 'NAV_RGIE_DOSSIERS'),
        ('ADMIN', 'NAV_RGIE_CONTROLES'),
        ('GERANT', 'NAV_RGIE_DOSSIERS'),
        ('GERANT', 'NAV_RGIE_CONTROLES'),
        ('TECHNICIEN', 'NAV_RGIE_DOSSIERS'),
        ('TECHNICIEN', 'NAV_RGIE_CONTROLES')
) AS source (role_code, permission_code)
ON target.role_code = source.role_code
AND target.permission_code = source.permission_code
WHEN NOT MATCHED THEN
    INSERT (role_code, permission_code)
    VALUES (source.role_code, source.permission_code);
