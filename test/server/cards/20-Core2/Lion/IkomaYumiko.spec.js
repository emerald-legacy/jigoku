import { GameMode } from '../../../../../build/server/GameMode.js';

describe('Ikoma Yumiko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    dynastyDiscard: ['ikoma-yumiko']
                }
            });
            this.yumiko = this.player1.placeCardInProvince('ikoma-yumiko', 'province 1');
        });

        it('claims the Imperial Favor after entering play', function() {
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Yumiko to claim the Emperor\'s favor');
        });
    });
});

describe('Ikoma Yumiko in Emerald', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 5,
                    dynastyDiscard: ['ikoma-yumiko']
                },
                gameMode: GameMode.Emerald
            });
            this.yumiko = this.player1.placeCardInProvince('ikoma-yumiko', 'province 1');
        });

        it('names the Empress\' favor', function() {
            this.player1.clickCard(this.yumiko);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.yumiko);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Yumiko to claim the Empress\' favor');
        });
    });
});

describe('Ikoma Yumiko skill bonus', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-yumiko', 'samurai-of-integrity']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'valiant-oathkeeper', 'serene-warrior']
                }
            });
            this.yumiko = this.player1.findCardByName('ikoma-yumiko');
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
        });

        it('gets +1 military and +1 political for each dishonored character the opponent controls', function() {
            expect(this.yumiko.getMilitarySkill()).toBe(3);
            expect(this.yumiko.getPoliticalSkill()).toBe(4);

            this.whisperer.dishonor();
            this.game.checkGameState(true);
            expect(this.yumiko.getMilitarySkill()).toBe(4);
            expect(this.yumiko.getPoliticalSkill()).toBe(5);

            this.oathkeeper.dishonor();
            this.game.checkGameState(true);
            expect(this.yumiko.getMilitarySkill()).toBe(5);
            expect(this.yumiko.getPoliticalSkill()).toBe(6);
        });

        it('does not count dishonored characters she controls', function() {
            this.samurai.dishonor();
            this.game.checkGameState(true);
            expect(this.samurai.isDishonored).toBe(true);
            expect(this.yumiko.getMilitarySkill()).toBe(3);
            expect(this.yumiko.getPoliticalSkill()).toBe(4);

            this.whisperer.dishonor();
            this.game.checkGameState(true);
            expect(this.yumiko.getMilitarySkill()).toBe(4);
            expect(this.yumiko.getPoliticalSkill()).toBe(5);
        });
    });
});
