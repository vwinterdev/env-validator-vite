import { createUI } from "./utils";
import { Log, RenderType } from "./type";
import { constants, messages } from "./const";

export const renderTable = (logs: Log[]) => {
    const UI = createUI()
    const table = UI.table().head(['Key', 'Value', 'Message'])
    for (const log of logs) {
        const colorMessage = log.isError ? 'red' : 'green'
        table.row([log.key, log.value || constants.noValue, UI.colors[colorMessage](log.message)])
    }
    table.render()
}

const renderConsole = (logs: Log[]) => {
    const UI = createUI()
    logs.sort((a) => a.isError ? 1 : -1)
    for (const log of logs) {
        const methodMessage = log.isError ? 'fatal' : 'success'
        const displayMessage = `${log.key}: ${log.value || constants.noValue} -> ${log.message}`
        UI.logger[methodMessage](displayMessage)
    }
}

const renders = {
    table: renderTable,
    console: renderConsole,
}

export const selectRender = (render: RenderType) => {
    if(typeof render === 'function') {
        return render
    }
    const renderFn = renders[render]
    if(!renderFn){
        const UI = createUI()
        UI.logger.fatal(messages.renderNotFound(render))
        process.exit(1)
    }
    return  renderFn
}