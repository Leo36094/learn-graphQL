import React from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'

const VOTE_MUTATION = gql`
	mutation VoteMutation($linkId: ID!) {
		vote(linkId: $linkId) {
			id
			link {
				id
				votes {
					id
					user {
						id
					}
				}
			}
			user {
				id
			}
		}
	}
`

const Link = (props) => {
	const { link, index, updatedStoreAfterVote } = props
	const authToken = localStorage.getItem(AUTH_TOKEN)

	return (
		<div className='flex mt2 item-start'>
			<div className='flex item-center'>
				<span className='gray'>{index + 1}</span>
				{authToken && (
					<Mutation
						mutation={VOTE_MUTATION}
						variables={{ linkId: link.id }}
						update={(store, { data: { vote } }) =>
							updatedStoreAfterVote(store, vote, link.id)
						}>
						{(voteMutation) => (
							<div className='ml1 gray f11' onClick={voteMutation}>
								▲
							</div>
						)}
					</Mutation>
				)}
			</div>
			<div className='ml1'>
				<div>
					{link.description} ({link.url})
				</div>
				<div className='f6 lh-copy gray'>
					{link.votes.length} votes | by
					{link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
					{timeDifferenceForDate(link.createdAt)}
				</div>
			</div>
		</div>
	)
}

export default Link
