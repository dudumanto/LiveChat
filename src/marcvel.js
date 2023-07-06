import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import SelectOption from 'components/elements/SelectOption'
import Grid from '@material-ui/core/Grid'
import Breadcrumb from 'components/elements/breadcrumb'
import CloudUpload from '@material-ui/icons/CloudUpload'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import momment from 'moment'
import TextField from './elements/TextField'
import Autosuggest from './elements/Autosuggest'
import _ from 'lodash'
import { Button } from '@material-ui/core'

export default function form(props) {
  const [dataSelect, setDataSelect] = useState([])
  const [data, setData] = useState([])
  const [product, setProduct] = useState([])
  const [journey, setJourney] = useState([])
  const [reason, setReason] = useState([])
  const [explanation, setExplanation] = useState([])
  const [selectedOptions, setSelected] = useState({product:"",journey:"",reason:"",explanation:""})
  const [tag, setTag] = useState([])
  const [clear, setClear] = useState(false)

  function setCampoSelect(value) {
    setDataSelect(value)
  }
  useEffect(() => {
    getOptions()
  }, [])

  useEffect(() => {
    console.log('selectedOptions', selectedOptions)
  })

  const GlobalCss = withStyles({
    '@global': {
      '.txtForm': {
        // marginTop: '10px',
      },
      '.txtForm div input[type=text]': {
        padding: '10px !important'
      },
      '.txtForm div fieldset': {
        borderColor: '#6c6c6c !important'
      },
      '.txtForm label': {
        color: '#4a4848 !important',
        fontWeight: 'bold'
      },
      '.fieldset': {
        padding: '3px 3px 3px 10px',
        border: '1px solid #00000042',
        borderRadius: '4px',
        margin: '0px 0px 10px 0px',
        textAlign: 'start'
      },
      '.status fieldset': {
        backgroundColor: `${CORES.primeira}26`
      },
      '.status div': {
        color: `${CORES.terceira} !important`
      }
    }
  })(() => null)

  const styles = {
    root: {
      padding: '12px',
      flexGrow: 1
    },
    paper: {
      color: 'rgba(0, 0, 0, 0.54)',
      padding: '16px',
      textAlign: 'center'
    }
  }

  const getOptions = async () => {
    try {
      const body = selectedOptions
      console.log("Selected OP",selectedOptions)
      const response = await fetch(
        `${ENV.localUrl}/cmsproxy/simulators/get-options`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }

      )
      const json = await response.json()
      setProduct(formatOptions(json.products))
      setJourney(formatOptions(json.journey))
      setReason(formatOptions(json.reason))
      setExplanation(formatOptions(json.explanation))
      console.log("json",json)

      setData(json.content.original)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was canceled via controller.abort')
        return
      }
    }
  }

  const getOptionsProduct = async (name, search) => {
    try {
      const body = {
        column: name,
        search: search 
      }
      const response = await fetch(
        `${ENV.localUrl}/cmsproxy/simulators/get-options`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }

      )
      const json = await response.json()
      setProduct(formatOptions(json.products))
      setJourney([{ name: "Selecione um produto." }])
      setReason([{ name: "Selecione um produto e uma jornada." }])
      setExplanation ([{name:"Selecione um dos filtros acima"}])

      return console.log('json', json)
      setData(json.content.original)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was canceled via controller.abort')
        return
      }
    }
  }

  const getTag = async (explanation) => {
    try {
      const body = {
        explanation: explanation
      }
      const response = await fetch(
        `${ENV.localUrl}/cmsproxy/simulators/get-tag`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }

      )
      const json = await response.json()
      setTag(json)
      return console.log('tag', json)//setTag (json)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was canceled via controller.abort')
        return
      }
    }
  }

  function getValues(value) {
    if (value != undefined)
      return dataSelect.length > 0 ? dataSelect[0][value] || '- ' : null
  }

  function getDate(date) {
    if (date != undefined) {
      const separeteDate = dataSelect[0][date].split(':')
      separeteDate.splice(2, 1)
      const dateValue = `${separeteDate[0]}:${separeteDate[1]}`
      return dataSelect.length > 0 ? dateValue || '- ' : null
    }
  }

  function handleOptionChange(name, value) {
    console.log(name, value, selectedOptions)
    const so = selectedOptions
    so[name] = _.get(value,'[0].name',"") 
    setSelected(so)
    console.log("set",selectedOptions)
    getOptions()
  }

  function handleExplanationChange(name, value) {
    getTag(_.get(value, "[0].name", ''))

  }

  function formatOptions(values) {
    const options = []
    Object.keys(values).forEach(key => {
      options.push({ name: values[key] })
      
    })
    console.log(options)
    return (options)
  }

  useEffect(()=>{
    setClear(false)
  },[clear]) 


  function limparFiltros(){
  setClear(true)

  setSelected({product:"",journey:"",reason:"",explanation:""})
  getOptionsProduct()
  setTag()
  }


  return (
    <>
      <GlobalCss />
      <Breadcrumb links={[{ nome: 'Simulador TAGMAP' }]} />
      <div style={styles.root}>
        <Paper style={styles.paper}>
          <h3> Simulador TAGMAP </h3>
          <Grid container spacing={24} style={{ padding: '5px 5px 11px' }}>
            <Grid item xs={4} >
              <h4>Produtos</h4>
              <SelectOption
                style={{ marginTop: 0 }}
                name='product'
                multiple={false}
                clearOptions = {clear}
                content={product}
                handleChange={(name, value) => handleOptionChange(name, value)}
              />
            </Grid>
            <Grid item xs={4}>
              <h4>Jornadas</h4>
              <SelectOption
                style={{ marginTop: 0 }}
                name='journey'
                clearOptions = {clear}
                content={_.get(selectedOptions, 'product.length', 0) > 0 ? journey : [{ name: "Selecione um produto." }]}
                handleChange={(name, value) => handleOptionChange(name, value)}
              />
            </Grid>
            <Grid item xs={4}>
              <h4>Razões</h4>
              <SelectOption
                style={{ marginTop: 0 }}
                name='reason'
                clearOptions = {clear}
                content={_.get(selectedOptions, 'journey.length', 0) > 0 ? reason : [{ name: "Selecione um produto e uma jornada." }]}
                handleChange={(name, value) => handleOptionChange(name, value)}
              />
            </Grid>
            <Grid item xs={12} style={{ marginRight: '15px' }}>
              <h4>Metrificação</h4>
              <SelectOption
                style={{ marginTop: 0 }}
                name='explanation'
                clearOptions = {clear}
                content={_.get(selectedOptions, 'product.length', 0) > 0 ? explanation : [{ name: "Selecione um dos filtros acima." }]}
                handleChange={(name, value) => handleExplanationChange(name, value)}
              />
            </Grid>

            <Grid item xs={12}>
              <h4>TAG</h4>
            {ture ? <TextField name='Tag' defaultValue={.get(tag, "tag[0].tag", '')} /> : <React.Fragment />} 
              
            </Grid>

            <Grid item xs={12} style={{ marginRight: '15px' }}>
              <Button item xs={6}
              size="medium"
              variant="contained"
              color="primary"
              onClick={()=>limparFiltros()}
              >Limpar Filtros</Button>

            </Grid>


          </Grid>
        </Paper>
      </div>
    </>
  )
}