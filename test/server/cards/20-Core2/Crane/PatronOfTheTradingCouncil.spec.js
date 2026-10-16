describe('Patron of the Trading Council', function () {
    integration(function () {
        describe('Static skill bonus', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['patron-of-the-trading-council', 'kudaka']
                    },
                    player2: {
                        inPlay: ['mantis-tenkinja']
                    }
                });

                this.patron = this.player1.findCardByName('patron-of-the-trading-council');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.tenkinja = this.player2.findCardByName('mantis-tenkinja');

                this.noMoreActions();
            });

            it('gains +1/+1 while paired with Mantis', function () {
                this.initiateConflict({
                    attackers: [this.patron, this.kudaka],
                    defenders: []
                });

                expect(this.patron.militarySkill).toBe(3);
                expect(this.patron.politicalSkill).toBe(3);
            });

            it('gains +1/+1 while against Mantis', function () {
                this.initiateConflict({
                    attackers: [this.patron],
                    defenders: [this.tenkinja]
                });

                expect(this.patron.militarySkill).toBe(3);
                expect(this.patron.politicalSkill).toBe(3);
            });

            it('does not gain +1/+1 while no mantis is around', function () {
                this.initiateConflict({
                    attackers: [this.patron],
                    defenders: []
                });

                expect(this.patron.militarySkill).toBe(2);
                expect(this.patron.politicalSkill).toBe(2);
            });
        });

        describe('Action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['patron-of-the-trading-council'],
                        conflictDiscard: ['banzai', 'fine-katana', 'assassination']
                    },
                    player2: {
                        inPlay: [],
                        conflictDiscard: ['let-go', 'ornate-fan', 'watch-commander']
                    }
                });

                this.patron = this.player1.findCardByName('patron-of-the-trading-council');

                this.player1.reduceDeckToNumber('conflict deck', 0);
                this.player2.reduceDeckToNumber('conflict deck', 0);

                this.banzai = this.player1.moveCard('banzai', 'conflict deck');
                this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.assassination = this.player1.moveCard('assassination', 'conflict deck');

                this.letGo = this.player2.moveCard('let-go', 'conflict deck');
                this.fan = this.player2.moveCard('ornate-fan', 'conflict deck');
                this.commander = this.player2.moveCard('watch-commander', 'conflict deck');
            });

            it('should prompt to choose a card for yourself', function () {
                this.player1.clickCard(this.patron);
                expect(this.player1).toHavePrompt('Choose a card to give to yourself');
                expect(this.player1).toHavePromptButton('Fine Katana');
                expect(this.player1).toHavePromptButton('Assassination');
            });

            it('should prompt to choose a card for opponent after choosing own card', function () {
                this.player1.clickCard(this.patron);
                this.player1.clickPrompt('Assassination');

                expect(this.player1).toHavePrompt('Choose a card to give your opponent');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Watch Commander');
            });

            it('should put the chosen cards into hands', function () {
                this.player1.clickCard(this.patron);
                this.player1.clickPrompt('Assassination');
                this.player1.clickPrompt('Watch Commander');

                expect(this.assassination.location).toBe('hand');
                expect(this.commander.location).toBe('hand');
            });

            it('should put the other cards on the bottom of the decks', function () {
                this.player1.clickCard(this.patron);
                this.player1.clickPrompt('Assassination');
                this.player1.clickPrompt('Watch Commander');

                expect(this.player1.conflictDeck).toEqual([this.banzai, this.katana]);
                expect(this.player2.conflictDeck).toEqual([this.letGo, this.fan]);
                expect(this.getChatLogs(10)).not.toContain('player1 is shuffling their conflict deck');
                expect(this.getChatLogs(10)).toContain('player1 puts 1 card on the bottom of their conflict deck');
                expect(this.getChatLogs(10)).toContain('player2 puts 1 card on the bottom of their conflict deck');
            });
        });
    });
});
