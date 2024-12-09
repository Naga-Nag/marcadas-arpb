CREATE OR ALTER FUNCTION MarcadaEntreFechas(@Departamento NVARCHAR(50), @FechaInicio DATE, @FechaFin DATE) 
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
        ui.Userid,
        ui.UserCode,
        ui.Name,
        d.DeptName,
        ci.CheckTime,
        ui.OtherInfo
    FROM
        dbo.Userinfo ui
        INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
        LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
    WHERE
        d.DeptName = @Departamento AND (ci.CheckTime BETWEEN @FechaInicio AND DATEADD(DAY, +1, @FechaFin))
    RETURN
END;
