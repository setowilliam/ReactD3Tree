import React, { Component } from 'react'
import * as d3 from 'd3'
import './Tree.css'


export default class Tree extends Component {

    constructor(props) {
        super(props)

        let root = d3.hierarchy(this.props.data)
        let treeLayout = d3.tree().size([this.props.height, this.props.width])
        treeLayout(root)

        this.state = {
            root: root
        }
    }

    componentDidMount = () => {
        this.renderTree()
    }

    shouldComponentUpdate = () => false
    
    renderTree = () => {
        const svgNode = this.svgNode
        const zoomNode = this.zoomNode

        var svg = d3.select(svgNode)
        var zoom = d3.select(zoomNode)

        svg.call(d3.zoom()
            .scaleExtent([0.5, 5])
            .on("zoom", () => zoom.attr("transform", d3.event.transform)))

        this.renderLinks(zoom)
        this.renderNodes(zoom)
    }

    renderNodes = (nodeGroup) => {
        nodeGroup.append("g")
            .attr('class', 'nodes')
            .selectAll('circle.node')
            .data(this.state.root.descendants())
            .enter()
            .append('circle')
            .classed('node', true)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 10)
    }

    renderLinks = (nodeLink) => {
        nodeLink.append("g")
            .attr('class', 'links')
            .selectAll('line.link')
            .data(this.state.root.links())
            .enter()
            .append('line')
            .classed('link', true)
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
    }

    render() {
        return (
            <svg ref={node => this.svgNode = node} className='svg-container'>
                <g ref={node => this.zoomNode = node} />
            </svg>
        )
    }

}