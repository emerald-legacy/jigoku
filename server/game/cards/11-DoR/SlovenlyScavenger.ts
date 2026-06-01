import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { TargetModes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SlovenlyScavenger extends DrawCard {
    static id = 'slovenly-scavenger';

    setupCardAbilities() {
        this.reaction({
            title: 'Shuffle a discard pile into a deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                activePromptTitle: 'Choose which discard pile to shuffle:',
                choices: {
                    [this.getChoiceName('MyDynasty')]: (context: AbilityContext) => context.player.dynastyDiscardPile.length > 0,
                    [this.getChoiceName('MyConflict')]: (context: AbilityContext) => context.player.conflictDiscardPile.length > 0,
                    [this.getChoiceName('OppDynasty')]: (context: AbilityContext) => !!(context.player.opponent && context.player.opponent.dynastyDiscardPile.length > 0),
                    [this.getChoiceName('OppConflict')]: (context: AbilityContext) => !!(context.player.opponent && context.player.opponent.conflictDiscardPile.length > 0)
                }
            },
            effect: 'shuffle {1} into their deck',
            effectArgs: context => this.getEffectArg(context ? context.select : ''),
            handler: context => {
                if(context.select === this.getChoiceName('MyDynasty')) {
                    this.owner.dynastyDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Locations.DynastyDeck);
                    });
                    this.owner.shuffleDynastyDeck();
                }
                if(context.select === this.getChoiceName('MyConflict')) {
                    this.owner.conflictDiscardPile.forEach(card => {
                        this.owner.moveCard(card, Locations.ConflictDeck);
                    });
                    this.owner.shuffleConflictDeck();
                }
                const opponent = this.owner.opponent;
                if(opponent && context.select === this.getChoiceName('OppDynasty')) {
                    opponent.dynastyDiscardPile.forEach(card => {
                        opponent.moveCard(card, Locations.DynastyDeck);
                    });
                    opponent.shuffleDynastyDeck();
                }
                if(opponent && context.select === this.getChoiceName('OppConflict')) {
                    opponent.conflictDiscardPile.forEach(card => {
                        opponent.moveCard(card, Locations.ConflictDeck);
                    });
                    opponent.shuffleConflictDeck();
                }
            }
        });
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
