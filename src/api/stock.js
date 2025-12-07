import {API_BASE_URL} from './config.js'

/**
 * 获取股票列表数据
 * @param {number} page 页码
 * @param {number} size 每页数量
 * @param {string} gpdm 股票代码参数（可选）
 * @returns Promise
 */
const token = localStorage.getItem('token')
export async function getStockList(page = 1, size = 20, gpdm = null) {
    try {
        // 构造基础URL
        let url = `${API_BASE_URL}/lst/api/stock/stockList/${page}/${size}`

        // 如果提供了股票代码参数，则添加到URL查询参数中
        if (gpdm) {
            url += `?gpdm=${encodeURIComponent(gpdm)}`
        }

        console.log('请求URL:', url); // 添加日志以便调试

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('返回数据:', data); // 添加日志以便调试
        return data
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}

// 同步股票最新交易记录
export async function syncStock() {
    try {
        // 构造基础URL
        let url = `${API_BASE_URL}/lst/api/stock/sync/stock`

        // 如果提供了股票代码参数，则添加到URL查询参数中


        console.log('请求URL:', url); // 添加日志以便调试

        const response = await fetch(url, {method: `POST`})
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('股票交易记录同步成功'); // 添加日志以便调试
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}

// 同步股票最新交易记录
export async function selectHign(startDate= null, top = null) {
    try {
        // 构造基础URL
        let url = `${API_BASE_URL}/lst/api/stock/rangeTimeTop`

        // 如果提供了股票代码参数，则添加到URL查询参数中


        console.log('请求URL:', url); // 添加日志以便调试

        const response = await fetch(url,
            {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate:startDate,
                    top: top
                })
            })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('这个月还没有高于月初开盘价记录筛选成功'); // 添加日志以便调试
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}

// 同步股票最新交易记录
export async function selectCon(startDate= null, continous = null, top = null) {
    try {
        // 构造基础URL
        let url = `${API_BASE_URL}/lst/api/stock/lowrangeTimeTop`

        // 如果提供了股票代码参数，则添加到URL查询参数中


        console.log('请求URL:', url); // 添加日志以便调试

        const response = await fetch(url,
            {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate:startDate,
                    continous: continous,
                    top: top
                })
            }
            )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('连续几天都是跌的股票筛选成功'); // 添加日志以便调试
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}


// 同步股票最新交易记录
export async function queryStockDetail(gpdm= null) {
    try {
        // 构造基础URL
        let url = `${API_BASE_URL}/lst/api/stock/stockDetail/${gpdm}`

        // 如果提供了股票代码参数，则添加到URL查询参数中


        console.log('请求URL:', url); // 添加日志以便调试

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log(gpdm+'明细查询成功'); // 添加日志以便调试
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('获取股票列表失败:', error)
        throw error
    }
}

export default {
    getStockList,
    syncStock,
    selectHign,
    selectCon,
    queryStockDetail
}