import { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';

export default function App() {

  const [modalGet, setModalGetVisivel] = useState(false)
  const [modalGetID, setModalGetID] = useState(false)
  const [modalPut, setModalPutVisivel] = useState(false)
  const [modalPost, setModalPostVisivel] = useState(false)
  const [modalDelete, setModalDeleteVisivel] = useState(false)

  const [idDigitado,setIDDigitado] = useState("")

  const renderizarItem = ({ item }) => (
    <View>
      <Text>{item.id} - {item.title}</Text>
    </View>
  );

  // --- Função GET BY ID---
  const pesquisarPorID = async () => {
    await executarConsulta("SELECT * FROM camisetas WHERE id LIKE ?;", [
      `%${idDigitado}%`,
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => setModalGetVisivel(true)}>
          <Text>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalGetIDVisivel(true)}>
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
            data={[
              { id: 1, title: 'Item 1' },
              { id: 2, title: 'Item 2' },
              { id: 3, title: 'Item 3' },
              { id: 4, title: 'Item 4' },
              { id: 5, title: 'Item 5' },
            ]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderizarItem}
          />
        </View>
      </Modal>

      {/* Get By ID*/}
      <Modal
        visible={modalPut}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPutVisivel(false)}
      >
        <TextInput
          style={estilos.campoTexto}
          placeholder="Digite um ID"
          placeholderTextColor="#6B7280"
          value={idDigitado}
          onChangeText={(texto) => {
            setIDDigitado(texto);
            setTemTexto(texto.trim().length > 0);
          }}
        />
        <TouchableOpacity
          style={estilos.botao}
          onPress={pesquisarPorID}
          disabled={!db}
        >
          <Text style={estilos.textoBotao}>🔎</Text>
        </TouchableOpacity>
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
