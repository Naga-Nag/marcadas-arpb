CREATE OR ALTER FUNCTION MarcadaEntreFechas(@FechaInicio DATE, @FechaFin DATE) 
RETURNS @Resultado TABLE 
(
    UID INT,
    MR INT,
    Nombre VARCHAR(100),
    Departamento VARCHAR(100),
    Marcada DATETIME
)
AS
BEGIN
    INSERT INTO @Resultado
    SELECT
        ui.Userid,
        ui.UserCode,
        ui.Name,
        d.DeptName,
        ci.CheckTime
    FROM
        dbo.Userinfo ui
        INNER JOIN dbo.Dept d ON ui.Deptid = d.Deptid
        LEFT JOIN dbo.Checkinout ci ON ui.Userid = ci.Userid
    WHERE
        ci.CheckTime BETWEEN @FechaInicio AND @FechaFin
    RETURN
END;