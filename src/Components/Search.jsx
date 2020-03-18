import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { Circle } from 'react-preloaders';
import Tooltip from '@material-ui/core/Tooltip';
import Slide from '@material-ui/core/Slide';
import { MDBRow, MDBCol, MDBContainer, MDBNavLink } from 'mdbreact';
import { MDBAlert } from 'mdbreact';
import TextField from '@material-ui/core/TextField';



function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'rotation_period', numeric: false, disablePadding: false, label: 'Rotation Period' },
    { id: 'orbital_period', numeric: false, disablePadding: false, label: 'Orbital Period' },
    { id: 'diameter', numeric: false, disablePadding: false, label: 'Diameter' },
    { id: 'climate', numeric: false, disablePadding: false, label: 'Climate' },
    { id: 'surface_water', numeric: false, disablePadding: false, label: 'Surface Water' },
    { id: 'population', numeric: false, disablePadding: false, label: 'Population' },
    { id: 'created', numeric: false, disablePadding: false, label: 'Created' },
    
];

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class EnrolledAutoPayHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { order, orderBy } = this.props;

        return (

            <TableHead>
                <TableRow>

                    {rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'right' : 'left'}
                                padding={row.disablePadding ? 'none' : 'checkbox'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

EnrolledAutoPayHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    Stripped: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
});

class SearchData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'population11',
            data: [],
            orginalData:[],
            page: 0,
            rowsPerPage: 10,
            selectedPage:0,
            count: 0,
            loading: false,
            showNoData: false,
            showSearcherror: false,
            searchtext:''
        };
        this.SearchhandleChange = this.SearchhandleChange.bind(this);
        this.BindPlanetsData = this.BindPlanetsData.bind(this);
    }
    componentDidMount() {
        this.BindPlanetsData();
    }
    BindPlanetsData(index=0,isSearch=false,searchText="") {
     
        this.setState({ loading: true });
        var url = "";
        if (!isSearch)
            url = ('https://swapi.co/api/planets' + (index > 0 ? ('/' + index + '/') : '/'));
        else
            url = ('https://swapi.co/api/planets/?search=' + searchText);
        fetch(url, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(res => {
               
                var order = this.state.order;
               var Sortdata= res.results.sort(function (a, b) {
                    if (a.population === "unknown")
                        a.population = -1;
                    if (b.population === "unknown")
                       b.population = -1;
                   if (order ==="asc")
                       return a.population - b.population
                   else
                       return b.population - a.population
                })

                this.setState({ count: res.count, data: Sortdata, orginalData: Sortdata, showNoData: (Sortdata.length > 0 ? false : true) });
                this.setState({ loading: false });
            })
    }
    handleRequestSort = (event, property) => {
       
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy });
       
    };
    SearchhandleChange = name => event => {
        
        this.setState({ showSearcherror: false });
        this.setState({ showNoData: false });
        var SearchText = event.target.value;
        if (SearchText != undefined && SearchText.length > 0) {
            this.setState({ searchtext: event.target.value });
            if (SearchText.length > 15 && localStorage.getItem("user") !== "Luke Skywalker") {
                this.setState({ showSearcherror: true });
            }
            else {
                this.BindPlanetsData(0, true, SearchText);
            }
        }
        else {
            this.setState({ searchtext: "" });
            this.BindPlanetsData(0,false);
        }
    };
    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };
    handleChangePage = (event, page) => {
        this.setState({ page });
        this.BindPlanetsData(page, false);
    };
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        var defaultheight = (order =="desc" ?140 : 40);
        var sizeArray = [];
        
        return (
            <section class="page-wrapper">
                {this.state.loading === true && <Circle color={'#005984'} bgColor={'rgba(255,255,255,0.8)'} customLoading={this.state.loading} />}
                <MDBContainer>
                    <MDBRow>
                        <div class="pageheading-wrapper">
                            <MDBCol lg="6" sm="5" xs="12">
                                <div class="pageheading-box"><h1 class="MainHeading">Planets List Data</h1></div>
                            </MDBCol>
                            <MDBCol lg="6" sm="2" xs="12">
                                <div class="pageheading-boxright"><b class="MainHeading">User Name:  {localStorage.getItem('user')}</b></div>
                            </MDBCol>
                            <MDBCol lg="12" sm="12" xs="12">

                                <div className="search">
                                    <TextField id="filled-required" value={this.state.searchtext} label="Search planets" onChange={this.SearchhandleChange('SearchGrid')} className={'searchtextfield'} margin="normal" variant="filled" />
                                </div>
                                {this.state.showSearcherror &&
                                    <MDBAlert height="100%" color="danger" className="warningError">
                                    {"For Search:-Only 15 character limitation allow for you."}
                                    </MDBAlert>
                                }
                            </MDBCol>
                           
                        </div>
                    </MDBRow>
            <Paper className={'tableMargin  responsiveTbl'}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnrolledAutoPayHead
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={this.state.count}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                        .map(n => {
                                            var found = sizeArray.find(function (element) {
                                                return element === n.population ;
                                            }); 
                                            if (found === undefined) {
                                                sizeArray.push(n.population);
                                                defaultheight = (order == "desc" ? (defaultheight - 10) : (defaultheight + 10));

                                            }
                                            return (
                                                <TableRow height={defaultheight + "px !important"} className={classes.Stripped}
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={n.id}
                                           
                                        >

                                            <TableCell width="10%" height={defaultheight+"px !important"}  padding="checkbox" align="left" data-label="name">{n.name === "unknown" ? "N/A" : n.name }</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="rotation_period">{n.rotation_period === "unknown" ? "N/A" : n.rotation_period}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="orbital_period">{n.orbital_period === "unknown" ? "N/A" : n.orbital_period}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="diameter">{n.diameter === "unknown" ? "N/A" : n.diameter}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="climate">{n.climate === "unknown" ? "N/A" : n.climate}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="surface_water">{n.surface_water === "unknown" ? "N/A" : n.surface_water}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="population">{n.population === -1 ? "N/A" : n.population}</TableCell>
                                            <TableCell width="10%"  padding="checkbox" align="left" data-label="created">{(n.created !== null && n.created !== undefined) ? new Date(n.created).toISOString().split('T')[0]:""}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                    
                        </TableBody>
                            </Table>
                            {this.state.showNoData &&
                                <MDBAlert height="100%" color="danger" className="warningError">
                                    {"Sorry, we could not find any results matching."}
                                </MDBAlert>
                            }
                </div>
               
                    </Paper>

                </MDBContainer>



            </section>
        );
    }
}

SearchData.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchData);
