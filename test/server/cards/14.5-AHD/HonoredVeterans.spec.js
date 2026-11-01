import { discardFromPlay, putIntoPlay } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Honored Veterans', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 50,
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    dynastyDiscard: ['honored-veterans', 'kakita-toshimoko', 'kakita-yoshi', 'daidoji-uji']
                },
                player2: {
                    fate: 50,
                    inPlay: ['yogo-hiroue', 'matsu-berserker'],
                    dynastyDiscard: ['honored-veterans', 'kakita-kaezin', 'masterpiece-painter', 'brash-samurai']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.hiroue = this.player2.findCardByName('yogo-hiroue');
            this.berserker = this.player2.findCardByName('matsu-berserker');

            this.veterans = this.player1.placeCardInProvince('honored-veterans', 'province 1');
            this.toshimoko = this.player1.placeCardInProvince('kakita-toshimoko', 'province 2');
            this.yoshi = this.player1.placeCardInProvince('kakita-yoshi', 'province 3');
            this.uji = this.player1.placeCardInProvince('daidoji-uji', 'province 4');

            this.veterans2 = this.player2.placeCardInProvince('honored-veterans', 'province 1');
            this.kaezin = this.player2.placeCardInProvince('kakita-kaezin', 'province 2');
            this.painter = this.player2.placeCardInProvince('masterpiece-painter', 'province 3');
            this.samurai = this.player2.placeCardInProvince('brash-samurai', 'province 4');
        });

        it('should not work if no characters have been bought', function () {
            this.player1.clickCard(this.veterans);
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('should forget a bushi that left play and was put into play again', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');
            this.player2.pass();

            const context = this.game.getFrameworkContext(this.player1.player);
            this.game.queueSimpleStep(() => discardFromPlay().resolve(this.toshimoko, context));
            this.game.queueSimpleStep(() => putIntoPlay().resolve(this.toshimoko, context));
            this.game.continue();
            expect(this.toshimoko.location).toBe('play area');

            this.player1.clickCard(this.veterans);
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('should let each player pick a bushi they bought and honor them both', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.kaezin);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.painter);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.uji);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.samurai);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.veterans);
            expect(this.player1).toBeAbleToSelect(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.uji);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.toshimoko);

            expect(this.player2).toBeAbleToSelect(this.kaezin);
            expect(this.player2).not.toBeAbleToSelect(this.painter);
            expect(this.player2).toBeAbleToSelect(this.samurai);
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            expect(this.player2).not.toBeAbleToSelect(this.hiroue);

            this.player2.clickCard(this.samurai);

            expect(this.toshimoko.isHonored).toBe(true);
            expect(this.samurai.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain(
                'player1 plays Honored Veterans to honor Kakita Toshimoko and Brash Samurai'
            );
        });

        it('should let you not pick a character if you don\'t want', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.kaezin);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.painter);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.uji);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.samurai);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.veterans);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            this.player2.clickCard(this.kaezin);
            expect(this.kaezin.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Honored Veterans to honor Kakita Kaezin');
        });

        it('should let both players not pick a character', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.kaezin);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.painter);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.uji);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.samurai);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.veterans);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.getChatLogs(5)).toContain('player1 plays Honored Veterans to honor no one');
        });

        it('should work if only one player has bought a bushi - just self', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');

            this.player2.clickCard(this.painter);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.veterans);
            this.player1.clickCard(this.toshimoko);

            expect(this.player2).toHavePrompt('Play cards from provinces');
            expect(this.toshimoko.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 plays Honored Veterans to honor Kakita Toshimoko');
        });

        it('should work if only one player has bought a bushi - just opponent', function () {
            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('0');

            this.player2.clickCard(this.kaezin);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.veterans);
            this.player2.clickCard(this.kaezin);
            expect(this.player2).toHavePrompt('Play cards from provinces');
            expect(this.kaezin.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 plays Honored Veterans to honor Kakita Kaezin');
        });
    });
});

describe('Honored Veterans with nothing to honor', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 50,
                    dynastyDiscard: ['honored-veterans', 'honored-veterans', 'kakita-toshimoko']
                },
                player2: {
                    fate: 50
                }
            });

            const veterans = this.player1.filterCardsByName('honored-veterans', 'dynasty discard pile');
            this.veterans1 = this.player1.placeCardInProvince(veterans[0], 'province 1');
            this.veterans2 = this.player1.placeCardInProvince(veterans[1], 'province 2');
            this.toshimoko = this.player1.placeCardInProvince('kakita-toshimoko', 'province 3');
        });

        it('should not be playable when every Bushi played this phase is already honored', function () {
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');
            this.player2.pass();

            this.player1.clickCard(this.veterans1);
            this.player1.clickCard(this.toshimoko);
            expect(this.toshimoko.isHonored).toBe(true);
            expect(this.veterans1.location).toBe('dynasty discard pile');

            this.player1.clickCard(this.veterans2);
            expect(this.player1).toHavePrompt('Play cards from provinces');
            expect(this.veterans2.location).toBe('province 2');
        });
    });
});
