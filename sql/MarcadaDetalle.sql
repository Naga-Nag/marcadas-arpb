CREATE OR ALTER FUNCTION MarcadaDetalle(
  @Departamento NVARCHAR(50),
  @FechaHoy DATE
)
RETURNS @Resultado TABLE 
(
  UID INT,
  MR INT,
  Nombre VARCHAR(100),
  Departamento VARCHAR(100),
  Marcada DATETIME,
  CUIL VARCHAR(50),
  Jornada TINYINT,
  Activo BIT
)
AS
BEGIN
  INSERT INTO @Resultado
  SELECT
    ui.Userid AS UID,
    ui.UserCode AS MR,
    ui.Name AS Nombre,
    d.DeptName AS Departamento,
    ci.CheckTime AS Marcada,
    ui.CUIL AS CUIL,
    ui.Jornada AS Jornada,
    ui.Activo AS Activo
  FROM
    dbo.Userinfo ui
  INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
  LEFT JOIN dbo.Checkinout ci 
    ON ui.Userid = ci.Userid AND CAST(ci.CheckTime AS DATE) = @FechaHoy
  WHERE (@Departamento = 'ARPB' OR d.DeptName = @Departamento)
  RETURN
END
