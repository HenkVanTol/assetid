import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import AuthForm from './AuthForm';
import { graphql } from 'react-apollo';
import mutation from '../mutations/Signup';
import query from '../queries/CurrentUser';

class SignupForm extends Component {
    constructor(props) {
        super(props);

        this.state = { errors: [], user: {}, loading: false  };
    }

    componentWillUpdate(nextProps) {
        if (!this.props.data.user && nextProps.data.user) {
            //user wasn't signed in but now is
            hashHistory.push('/assetSearch');
        }
    }

    onSubmit({ email, password }) {
        this.setState({ loading: true });
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [{ query }]
        })
        .then(() => {
            this.setState({ loading: false });
        })
        .catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors }); //es6: name value is the same
        });
    }
    render() {
        return (
            <div>
                <h2>Sign up</h2>
                <AuthForm errors={this.state.errors} loading={this.state.loading} onSubmit={this.onSubmit.bind(this)} />
            </div>
        );
    }
}

export default graphql(query)(
    graphql(mutation)(SignupForm)
);