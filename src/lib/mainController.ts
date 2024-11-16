import { globalStore } from "./globalStore";

let showMarcadaDetalle: boolean;

globalStore.subscribe((value) => {
    showMarcadaDetalle = value.showMarcadaDetalle;
});

export async function fetchMarcada(
    departamento: string,
    fecha: string,
    onBatch?: (batch: Array<Record<string, any>>) => void
): Promise<Array<Record<string, any>>> {
    const response = await fetch('/api/fetchMarcada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fecha })
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = ''; // Buffer to accumulate chunks
    const registros: Array<Record<string, any>> = []; // Final array of records

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Process the buffer for complete JSON batches
        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('\n')) >= 0) {
            const chunk = buffer.slice(0, boundaryIndex).trim(); // Extract one batch
            buffer = buffer.slice(boundaryIndex + 1); // Remove processed batch

            if (chunk) {
                try {
                    const batch = JSON.parse(chunk); // Parse the JSON batch
                    registros.push(...batch); // Add to the final array

                    // Call the callback with the batch if provided
                    if (onBatch) {
                        onBatch(batch);
                    }
                } catch (err) {
                    console.error('Failed to parse JSON batch:', err, chunk);
                }
            }
        }
    }

    // Handle any leftover data in the buffer
    if (buffer.trim()) {
        try {
            const batch = JSON.parse(buffer.trim());
            registros.push(...batch);

            // Call the callback with the final batch if provided
            if (onBatch) {
                onBatch(batch);
            }
        } catch (err) {
            console.error('Failed to parse final JSON batch:', err, buffer);
        }
    }

    // Return the accumulated records
    return registros;
}

export async function fetchMarcadaDetalle(departamento: string, fecha: string): Promise<Array<Record<string, any>>> {
    const response = await fetch('/api/fetchMarcadaDetalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fecha})
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }
    return response.json();
}

export async function fetchDepartamentos(): Promise<Array<Record<string, any>>> {
    const response = await fetch('/api/fetchDepartamentos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }
    return response.json();
}