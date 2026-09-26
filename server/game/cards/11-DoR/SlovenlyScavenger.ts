import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SlovenlyScavenger extends DrawCard {
    static id = 'slovenly-scavenger';

    setupCardAbilities() {
        this.reaction('Shuffle a discard pile into a deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .selectIf('target', {
                targets: true,
                activePromptTitle: 'Choose which discard pile to shuffle:'
            }, {
                [this.getChoiceName('MyDynasty')]: (context) => context.player.dynastyDiscardPile.length > 0,
                [this.getChoiceName('MyConflict')]: (context) => context.player.conflictDiscardPile.length > 0,
                [this.getChoiceName('OppDynasty')]: (context) => !!(context.player.opponent && context.player.opponent.dynastyDiscardPile.length > 0),
                [this.getChoiceName('OppConflict')]: (context) => !!(context.player.opponent && context.player.opponent.conflictDiscardPile.length > 0)
            })
            .handler(context => {
                if(context.select === this.getChoiceName('MyDynasty')) {
                    this.owner.dynastyDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Location.DynastyDeck);
                    });
                    this.owner.shuffleDynastyDeck();
                }
                if(context.select === this.getChoiceName('MyConflict')) {
                    this.owner.conflictDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Location.ConflictDeck);
                    });
                    this.owner.shuffleConflictDeck();
                }
                const opponent = this.owner.opponent;
                if(opponent && context.select === this.getChoiceName('OppDynasty')) {
                    opponent.dynastyDiscardPile.forEach(card => {
                        opponent.moveCard(card, Location.DynastyDeck);
                    });
                    opponent.shuffleDynastyDeck();
                }
                if(opponent && context.select === this.getChoiceName('OppConflict')) {
                    opponent.conflictDiscardPile.forEach(card => {
                        opponent.moveCard(card, Location.ConflictDeck);
                    });
                    opponent.shuffleConflictDeck();
                }
            })
            .effect('shuffle {1} into their deck', context => this.getEffectArg(context ? context.select : ''));
    }

    getEffectArg(selection: string) {
        if(selection === this.getChoiceName('MyDynasty')) {
            return this.owner.name + '\'s dynasty discard pile';
        }
        if(selection === this.getChoiceName('MyConflict')) {
            return this.owner.name + '\'s conflict discard pile';
        }
        if(this.owner.opponent && selection === this.getChoiceName('OppDynasty')) {
            return this.owner.opponent.name + '\'s dynasty discard pile';
        }
        if(this.owner.opponent && selection === this.getChoiceName('OppConflict')) {
            return this.owner.opponent.name + '\'s conflict discard pile';
        }
        return 'Unknown target';
    }


    getChoiceName(key: string) {
        if(key === 'MyDynasty') {
            return `${this.owner.name}'s Dynasty`;
        }
        if(key === 'MyConflict') {
            return `${this.owner.name}'s Conflict`;
        }
        if(this.owner.opponent) {
            if(key === 'OppDynasty') {
                return `${this.owner.opponent.name}'s Dynasty`;
            }
            if(key === 'OppConflict') {
                return `${this.owner.opponent.name}'s Conflict`;
            }
        }

        return 'N/A';
    }
}


export default SlovenlyScavenger;
