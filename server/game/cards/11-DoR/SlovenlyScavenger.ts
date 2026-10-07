import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { deckChoiceName } from '../deckChoiceName.js';

class SlovenlyScavenger extends DrawCard {
    static id = 'slovenly-scavenger';

    setupCardAbilities() {
        this.reaction('Shuffle a discard pile into a deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .cost(costs.sacrificeSelf())
            .select({
                targets: true,
                activePromptTitle: 'Choose which discard pile to shuffle:'
            }, {
                [deckChoiceName(this.owner, 'MyDynasty')]: () => this.owner.dynastyDiscardPile.length > 0,
                [deckChoiceName(this.owner, 'MyConflict')]: () => this.owner.conflictDiscardPile.length > 0,
                [deckChoiceName(this.owner, 'OppDynasty')]: () => !!this.owner.opponent && this.owner.opponent.dynastyDiscardPile.length > 0,
                [deckChoiceName(this.owner, 'OppConflict')]: () => !!this.owner.opponent && this.owner.opponent.conflictDiscardPile.length > 0
            })
            .handler(context => {
                if(context.select === deckChoiceName(this.owner, 'MyDynasty')) {
                    this.owner.dynastyDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Location.DynastyDeck);
                    });
                    this.owner.shuffleDynastyDeck();
                }
                if(context.select === deckChoiceName(this.owner, 'MyConflict')) {
                    this.owner.conflictDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Location.ConflictDeck);
                    });
                    this.owner.shuffleConflictDeck();
                }
                const opponent = this.owner.opponent;
                if(opponent && context.select === deckChoiceName(this.owner, 'OppDynasty')) {
                    opponent.dynastyDiscardPile.forEach(card => {
                        opponent.moveCard(card, Location.DynastyDeck);
                    });
                    opponent.shuffleDynastyDeck();
                }
                if(opponent && context.select === deckChoiceName(this.owner, 'OppConflict')) {
                    opponent.conflictDiscardPile.forEach(card => {
                        opponent.moveCard(card, Location.ConflictDeck);
                    });
                    opponent.shuffleConflictDeck();
                }
            })
            .effect('shuffle {1} into their deck', context => this.getEffectArg(context.select));
    }

    getEffectArg(selection: string) {
        if(selection === deckChoiceName(this.owner, 'MyDynasty')) {
            return this.owner.name + '\'s dynasty discard pile';
        }
        if(selection === deckChoiceName(this.owner, 'MyConflict')) {
            return this.owner.name + '\'s conflict discard pile';
        }
        if(this.owner.opponent && selection === deckChoiceName(this.owner, 'OppDynasty')) {
            return this.owner.opponent.name + '\'s dynasty discard pile';
        }
        if(this.owner.opponent && selection === deckChoiceName(this.owner, 'OppConflict')) {
            return this.owner.opponent.name + '\'s conflict discard pile';
        }
        return 'Unknown target';
    }
}


export default SlovenlyScavenger;
