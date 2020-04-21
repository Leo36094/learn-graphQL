import React, { useState } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

const FEED_SEATCH_QUERY = gql`
	query FeedSearchQuery($filter: String!) {
		feed(filter: $filter) {
			links {
				id
				url
				description
				createdAt
				postedBy {
					id
					name
				}
				votes {
					id
					user {
						id
					}
				}
			}
		}
	}
`

const Search = (props) => {
	const { client } = props

	const [links, setLinks] = useState([])
	const [filter, setFilter] = useState('')

	const _executeSeatch = async () => {
		const result = await client.query({
			query: FEED_SEATCH_QUERY,
			variables: { filter },
		})

		const links = result.data.feed.links
		setLinks(links)
	}

	return (
		<div>
			<div>
				Search
				<input type='text' onChange={(e) => setFilter(e.target.value)} />
				<button onClick={() => _executeSeatch()}>Search</button>
			</div>
			{links.map((link, index) => (
				<Link key={link.id} link={link} index={index} />
			))}
		</div>
	)
}

export default withApollo(Search)
