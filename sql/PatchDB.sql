
-- Tabla de usuarios web exclusivos para el sistema
CREATE TABLE WebUsers (
	id INT IDENTITY(1,1) PRIMARY KEY,
	username NVARCHAR(100) UNIQUE,
	password NVARCHAR(100),
	role NVARCHAR(10) CHECK (role IN ('ADMIN', 'USER')),

	departamento NVARCHAR(50),
	departamentosPermitidos NVARCHAR(50),
);

-- Informacion extra para la tabla de usuarios
ALTER TABLE dbo.Userinfo ADD Activo BIT;
ALTER TABLE dbo.Userinfo ADD Jornada TINYINT;
ALTER TABLE dbo.Userinfo ADD CUIL NVARCHAR(50);

