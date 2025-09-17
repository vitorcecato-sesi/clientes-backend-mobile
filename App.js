import { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, SafeAreaView, FlatList, TextInput } from 'react-native';

export default function App() {

  const [modalGet, setModalGetVisivel] = useState(false)
  const [modalGetByID, setModalGetByIDVisivel] = useState(false)
  const [modalPut, setModalPutVisivel] = useState(false)
  const [modalPost, setModalPostVisivel] = useState(false)
  const [modalDelete, setModalDeleteVisivel] = useState(false)

  const [idDigitado,setIDDigitado] = useState("")

  // Renderização do item
  const renderizarItem = ({ item }) => (
    <View style={styles.cardCliente}>
      <Text style={styles.cardId}>ID: <Text style={styles.cardValue}>{item.id}</Text></Text>
      <Text style={styles.cardLabel}>Nome: <Text style={styles.cardValue}>{item.nome}</Text></Text>
      <Text style={styles.cardLabel}>CPF: <Text style={styles.cardValue}>{item.cpf}</Text></Text>
      <Text style={styles.cardLabel}>Email: <Text style={styles.cardValue}>{item.email}</Text></Text>
      <Text style={styles.cardLabel}>Telefone: <Text style={styles.cardValue}>{item.telefone}</Text></Text>
    </View>
  )

  // --- Função GET BY ID---
  const pesquisarPorID = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/${idDigitado}`)
      const dadosBD = await response.json()
      setData([dadosBD])
    } catch (error) {
      setErroMsg("Erro ao buscar dados do cliente")
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => setModalGetVisivel(true)}>
          <Text>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalGetByIDVisivel(true)}>
          <Text>GET By ID</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalPutVisivel(true)}>
          <Text>PUT</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalPostVisivel(true)}>
          <Text>POST</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalDeleteVisivel(true)}>
          <Text>DELETE</Text>
        </TouchableOpacity>

      </View>


      {/* Get */}
      <Modal
        visible={modalGet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGetVisivel(false)}
      >
        <View>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderizarItem}
          />
        </View>
      </Modal>

      {/* Get By ID*/}
      <Modal
        visible={modalGetByID}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGetByIDVisivel(false)}
      >
        <View> 
          <TextInput
          style={styles.campoTexto}
          placeholder="Digite um ID"
          placeholderTextColor="#6B7280"
          value={idDigitado}
          onChangeText={setIDDigitado}
          keyboardType="numeric"
          />

          <TouchableOpacity
          style={styles.botao}
          onPress={pesquisarPorID}
          disabled={!db}
          >
            <Text style={styles.textoBotao}>🔎</Text>
          </TouchableOpacity>

          <FlatList
          data={data}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={renderizarItem}
          style={styles.lista}
          ListEmptyComponent={<Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>Nenhum cliente com esse ID encontrado.</Text>}
          />
        
          <TouchableOpacity
            style={styles.fecharButton}
            onPress={() => { setModalGetVisivel(false); setErroMsg(""); setData([]); setId(""); }}
          >
            <Text style={styles.fecharButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Put */}
      <Modal
        visible={modalPut}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPutVisivel(false)}
      >

      </Modal>

      {/* Post */}
      <Modal
        visible={modalPost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPostVisivel(false)}
      >

      </Modal>

      {/* Delete */}
      <Modal
        visible={modalDelete}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalDeleteVisivel(false)}
      >

      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
