const pool = require('../utils/mysql.connect');

const GetPayment = async ({transaction_id, numero_poliza , monto_pago, fecha_pago,metodo_pago, referencia, banco, sypago, status, email, aliado, plan,estado }) => {
    try {
        let msg = {
            status: false,
            message: 'Payment ya registered',
            code: 500
        };

        const connection = await pool.getConnection();

        // Verifica si transaction_id ya existe
        const sqlCheck = 'SELECT id_pago FROM pagos WHERE transaction_id = ?';
        const [rows] = await connection.execute(sqlCheck, [transaction_id]);

        if (rows.length > 0) {
            // Si existe, retorna el mensaje de que el pago ya está registrado
            msg = {
                status: true,
                message: 'Payment found',
                code: 200,
            };
        } else {
            // Si no existe, guarda la operación
            const sqlInsert = `
                INSERT INTO pagos ( id_poliza, monto_pago, fecha_pago, metodo_pago, referencia, banco, transaction_id, sypago, status,email,aliado,plan,estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.execute(sqlInsert, [
                numero_poliza, monto_pago, fecha_pago,metodo_pago, referencia, banco, transaction_id, sypago, status, email, aliado,plan,estado])

            msg = {
                status: true,
                message: 'Payment registered successfully',
                code: 201,
                insertId: result.insertId
            };
        }

        connection.release();
        return msg;
    } catch (err) {
        console.error('Error executing query', err);
        return {
            status: false,
            message: 'Internal server error',
            code: 500
        };
    }
}

module.exports = { GetPayment };
