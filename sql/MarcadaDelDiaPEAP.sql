CREATE OR ALTER FUNCTION MarcadaDelDia(@FechaHoy DATE) 
RETURNS @Resultado TABLE 
(
  UID INT,
  MR INT,
  Nombre VARCHAR(100),
  Departamento VARCHAR(100),
  Salida DATETIME,
  Entrada DATETIME--,
  --CUIL NVARCHAR(50),
  --DNI NVARCHAR(50),
  --ACTIVO NVARCHAR(10)
)
AS
BEGIN
  INSERT INTO @Resultado
  SELECT
    ui.Userid AS UID,
    ui.UserCode AS MR,
    ui.Name AS Nombre,
    d.DeptName AS Departamento,
    MAX(CASE WHEN DATEPART(HOUR, ci.CheckTime) >= 13 AND (CAST(ci.CheckTime AS DATE) = @FechaHoy) THEN ci.CheckTime END) AS Salida,
    MIN(CASE WHEN DATEPART(HOUR, ci.CheckTime) <= 10 AND (CAST(ci.CheckTime AS DATE) = @FechaHoy) THEN ci.CheckTime END) AS Entrada,
    p.CUIL,
    p.DNI,
    p.ACTIVO
  FROM
    dbo.Userinfo ui
  INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
  LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
  OUTER APPLY dbo.ParseHexFieldsToTable(ui.OtherInfo) AS p
  GROUP BY
    ui.Userid, ui.UserCode, ui.Name, d.DeptName, p.CUIL, p.DNI, p.ACTIVO
  RETURN
END