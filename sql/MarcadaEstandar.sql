CREATE OR ALTER FUNCTION MarcadaEstandar(@Departamento NVARCHAR(50), @FechaHoy DATE)
RETURNS @Resultado TABLE 
(
     UID INT,
     MR INT,
     Nombre VARCHAR(100),
     Departamento VARCHAR(100),
     Salida DATETIME,
     Entrada DATETIME,
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
          MAX(CASE WHEN DATEPART(HOUR, ci.CheckTime) >= 13 AND (CAST(ci.CheckTime AS DATE) = DATEADD(DAY, -1, @FechaHoy)) THEN ci.CheckTime END) AS Salida,
          MIN(CASE 
        WHEN DATEPART(HOUR, ci.CheckTime) <= 10
               AND (CAST(DATEADD(HOUR, -6, ci.CheckTime) AS DATE) = @FechaHoy) 
        THEN ci.CheckTime 
        ELSE NULL 
    END) AS Entrada,
          ui.CUIL AS CUIL,
          ui.Jornada AS Jornada,
          ui.Activo AS Activo
     FROM
          dbo.Userinfo ui
          INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
          LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
     WHERE d.DeptName = @Departamento
     GROUP BY
          ui.Userid, ui.UserCode, ui.Name, d.DeptName, ui.CUIL, ui.Jornada, ui.Activo
     RETURN
END