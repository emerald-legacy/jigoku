describe('Sensei\'s Heirloom', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-motso'],
                    hand: ['sensei-s-heirloom']
                },
                player2: {
                    inPlay: [],
                    hand: []
                }
            });

            this.motso = this.player1.findCardByName('kitsu-motso');
            this.senseiHeirloom = this.player1.findCardByName('sensei-s-heirloom');
        });

        it('gets a card to hand', function () {
            this.player1.clickCard(this.senseiHeirloom);
            this.player1.clickCard(this.motso);
            expect(this.player1).toHavePrompt('Any reactions to Sensei\'s Heirloom being played?');

            this.player1.clickCard(this.senseiHeirloom);
            expect(this.player1).toHavePrompt('Select a card');
            expect(this.player1).not.toHavePromptButton('Take nothing');
            expect(this.player1).toHavePromptButton('Supernatural Storm (4)');

            this.player1.clickPrompt('Supernatural Storm (4)');
            expect(this.getChatLogs(5)).toContain('player1 takes 1 card');
        });
    });
});

describe('Sensei\'s Heirloom search', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-motso', 'doji-whisperer'],
                    hand: ['sensei-s-heirloom'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'banzai', 'let-go', 'court-games']
                },
                player2: {
                    inPlay: [],
                    hand: []
                }
            });

            this.motso = this.player1.findCardByName('kitsu-motso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.senseiHeirloom = this.player1.findCardByName('sensei-s-heirloom');
            this.katana = this.player1.findCardByName('fine-katana', 'conflict deck');
            this.fan = this.player1.findCardByName('ornate-fan', 'conflict deck');
            this.banzai = this.player1.findCardByName('banzai', 'conflict deck');
            this.letGo = this.player1.findCardByName('let-go', 'conflict deck');
            this.courtGames = this.player1.findCardByName('court-games', 'conflict deck');
            this.player1.moveCard(this.courtGames, 'conflict deck');
            this.player1.moveCard(this.letGo, 'conflict deck');
            this.player1.moveCard(this.banzai, 'conflict deck');
            this.player1.moveCard(this.fan, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');
        });

        it('can only be attached to a Bushi', function () {
            this.player1.clickCard(this.senseiHeirloom);
            expect(this.player1).toBeAbleToSelect(this.motso);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });

        it('looks at twice the printed glory of the attached character', function () {
            this.player1.clickCard(this.senseiHeirloom);
            this.player1.clickCard(this.motso);
            this.player1.clickCard(this.senseiHeirloom);
            expect(this.player1).toHavePrompt('Select a card');
            expect(this.player1).toHavePromptButton('Fine Katana');
            expect(this.player1).toHavePromptButton('Ornate Fan');
            expect(this.player1).toHavePromptButton('Banzai!');
            expect(this.player1).toHavePromptButton('Let Go');
            expect(this.player1).not.toHavePromptButton('Court Games');
            expect(this.player1).not.toHavePromptButton('Supernatural Storm');
        });

        it('puts the chosen card into the hand and shuffles the deck', function () {
            this.player1.clickCard(this.senseiHeirloom);
            this.player1.clickCard(this.motso);
            this.player1.clickCard(this.senseiHeirloom);
            this.player1.clickPrompt('Banzai!');
            expect(this.banzai.location).toBe('hand');
            expect(this.katana.location).toBe('conflict deck');
            expect(this.fan.location).toBe('conflict deck');
            expect(this.letGo.location).toBe('conflict deck');
            expect(this.courtGames.location).toBe('conflict deck');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their conflict deck');
        });
    });
});
