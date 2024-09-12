class RecintosZoo {
    constructor() {
      // Recintos existentes com seus atributos: número, bioma, tamanho total, animais ocupados e tipos de animais presentes.
      this.recintos = [
        { numero: 1, bioma: 'savana', total: 10, ocupados: 3, animais: ['MACACO'] },
        { numero: 2, bioma: 'floresta', total: 5, ocupados: 0, animais: [] },
        { numero: 3, bioma: 'savana e rio', total: 7, ocupados: 2, animais: ['GAZELA'] },
        { numero: 4, bioma: 'rio', total: 8, ocupados: 0, animais: [] },
        { numero: 5, bioma: 'savana', total: 9, ocupados: 3, animais: ['LEAO'] }
      ];
  
      // Define os animais disponíveis, seu tamanho e os biomas em que eles se adaptam.
      this.animais = {
        LEAO: { tamanho: 3, biomas: ['savana'] },
        LEOPARDO: { tamanho: 2, biomas: ['savana'] },
        CROCODILO: { tamanho: 3, biomas: ['rio'] },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'] },
        GAZELA: { tamanho: 2, biomas: ['savana'] },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'] }
      };
    }
  
    analisaRecintos(animal, quantidade) {
      // Verifica se o animal é válido.
      if (!this.animais[animal]) return { erro: 'Animal inválido' };
      
      // Verifica se a quantidade é válida.
      if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: 'Quantidade inválida' };
  
      const { tamanho, biomas } = this.animais[animal];
      let recintosViaveis = [];
  
      this.recintos.forEach(recinto => {
        let espacoRestante = recinto.total - recinto.ocupados;
        let podeAcomodar = espacoRestante >= quantidade * tamanho;
        let biomaExato = recinto.bioma === biomas[0];
  
        // Se o animal for crocodilo e o bioma não for "rio", não inclui o recinto.
        if (animal === 'CROCODILO' && !biomaExato) return;
  
        // Verifica se há animais carnívoros no recinto e se o animal atual é carnívoro.
        const carnivorosNoRecinto = recinto.animais.some(a => ['LEAO', 'LEOPARDO', 'CROCODILO'].includes(a));
        
        // Se o animal é um macaco e a quantidade é 1, o recinto não pode estar vazio.
        const macacoSozinho = animal === 'MACACO' && quantidade === 1 && recinto.ocupados === 0;
        
        // Se há mais de uma espécie no recinto, deve considerar o espaço extra ocupado.
        const maisDeUmaEspecie = recinto.animais.length > 0 && !recinto.animais.includes(animal);
  
        // Verifica se o bioma do recinto é adequado para o animal.
        if (biomas.includes(recinto.bioma) || recinto.bioma.includes(biomas[0])) {
          if (podeAcomodar) {
            // Se o recinto já contém carnívoros e o animal não é carnívoro, não incluir o recinto.
            if (carnivorosNoRecinto && !recinto.animais.includes(animal)) return;
            
            // Se o animal é um macaco e está sozinho, não incluir o recinto.
            if (macacoSozinho) return;
            
            // Se o animal é um hipopótamo e há mais de uma espécie no recinto, ele só pode estar em recintos com "savana e rio".
            if (animal === 'HIPOPOTAMO' && maisDeUmaEspecie && recinto.bioma !== 'savana e rio') return;
  
            // Calcula o espaço extra necessário se há mais de uma espécie no recinto.
            const espacoOcupadoExtra = maisDeUmaEspecie ? (quantidade * tamanho + 1) : quantidade * tamanho;
  
            // Se o recinto tem espaço suficiente após considerar o espaço extra, adiciona à lista de recintos viáveis.
            if (espacoRestante >= espacoOcupadoExtra) {
              recintosViaveis.push({
                texto: `Recinto ${recinto.numero} (espaço livre: ${recinto.total - (recinto.ocupados + espacoOcupadoExtra)} total: ${recinto.total})`,
                biomaExato
              });
            }
          }
        }
      });
  
      // Ordena a lista de recintos viáveis, priorizando os recintos com bioma exato e depois por número do recinto.
      recintosViaveis.sort((a, b) => {
        if (a.biomaExato && !b.biomaExato) return -1;
        if (!a.biomaExato && b.biomaExato) return 1;
        return a.texto.localeCompare(b.texto);
      });
  
      // Retorna a lista de recintos viáveis ou uma mensagem de erro se nenhum recinto for viável.
      return recintosViaveis.length ? { recintosViaveis: recintosViaveis.map(r => r.texto) } : { erro: 'Não há recinto viável' };
    }
  }
  
  export { RecintosZoo as RecintosZoo };
